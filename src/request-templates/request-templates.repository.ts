import { HttpException, HttpStatus } from '@nestjs/common';
import Logger from 'config/log4js/logger';
import { RequestSignatoriesRepository } from 'src/request-signatories/request-signatories.repository';
import { RequestTypesRepository } from 'src/request-types/request-types.repository';
import { Connection, EntityRepository, Repository } from 'typeorm';
import { CreateRequestTemplateDto } from './dto/create-request-template.dto';
import { UpdateRequestTemplateDto } from './dto/update-request-template.dto';
import { RequestTemplate } from './entities/request-template.entity';

@EntityRepository(RequestTemplate)
export class RequestTemplatesRepository extends Repository<RequestTemplate> {
  private requestSignatoriesRepository: RequestSignatoriesRepository;
  private requestTypesRepository: RequestTypesRepository;
  constructor(private readonly connection: Connection) {
    super();
    this.requestSignatoriesRepository = this.connection.getCustomRepository(
      RequestSignatoriesRepository,
    );
    this.requestTypesRepository = this.connection.getCustomRepository(
      RequestTypesRepository,
    );
  }

  async createRequestTemplate(
    createRequestTemplateDto: CreateRequestTemplateDto,
  ) {
    const { signatoryIds, requestTypeId } = createRequestTemplateDto;

    const requestSignatories =
      await this.requestSignatoriesRepository.findByIds(signatoryIds);

    if (!requestSignatories) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'request signatory not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const requestType = await this.requestTypesRepository.findOne(
      requestTypeId,
    );

    if (!requestType) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'request type not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    createRequestTemplateDto.requestTypeId = requestType as any;
    createRequestTemplateDto.signatoryIds = requestSignatories as any;

    const requestTemplate = this.create(createRequestTemplateDto);

    try {
      await this.save(requestTemplate);
      return requestTemplate;
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'request template already exists',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        new Logger().log(
          'error',
          'RequestTemplatesRepository',
          'createRequestTemplate',
          error.message,
        );
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'something went wrong',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async updateRequestTemplate(
    id: string,
    updateRequestTemplateDto: UpdateRequestTemplateDto,
  ) {
    if (id.length !== 36) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'invalid request template id',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const signatories = await this.getRequestTemplateById(id);

    if (!signatories) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'request template not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const { signatoryIds, requestTypeId, name, subject, body } =
      updateRequestTemplateDto;

    let requestSignatories: any;
    if (signatoryIds) {
      signatoryIds.forEach((signatoryId) => {
        if (signatoryId.length !== 36) {
          throw new HttpException(
            {
              status: HttpStatus.BAD_REQUEST,
              error: `invalid request signatory id: ${signatoryId}`,
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      });
      requestSignatories = await this.requestSignatoriesRepository.findByIds(
        signatoryIds,
      );
      if (!requestSignatories) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'request signatory not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (requestTypeId) {
      if (requestTypeId.length !== 36) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'invalid request signatory id',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const requestType = await this.requestTypesRepository.getRequestTypeById(
        requestTypeId,
      );

      if (!requestType) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'request type not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    }

    signatories.name = name || signatories.name;
    signatories.subject = subject || signatories.subject;
    signatories.body = body || signatories.body;
    signatories.requestTypeId = requestTypeId || signatories.requestTypeId;
    signatories.signatoryIds = signatoryIds || signatories.signatoryIds;

    try {
      await this.save(signatories);
      return signatories;
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'request template already exists',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        console.log('ERROR', error);

        new Logger().log(
          'error',
          'error',
          error.message,
          'updateRequestTemplate',
        );
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'something went wrong',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getRequestTemplateById(id: string) {
    if (id.length !== 36) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'invalid id',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const requestTemplate = await this.connection
      .getRepository(RequestTemplate)
      .createQueryBuilder('requestTemplate')
      .innerJoinAndSelect('requestTemplate.requestTypeId', 'requestType')
      .innerJoinAndSelect('requestTemplate.signatoryIds', 'signatory')
      .where('requestTemplate.id = :id')
      .setParameter('id', id)
      .getOne();

    if (!requestTemplate) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'request template not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return requestTemplate;
  }

  async getRequestTemplates() {
    const requestTemplates = await this.connection
      .getRepository(RequestTemplate)
      .createQueryBuilder('requestTemplate')
      .innerJoinAndSelect('requestTemplate.requestTypeId', 'requestType')
      .innerJoinAndSelect('requestTemplate.signatoryIds', 'signatory')
      .getMany();
    return requestTemplates;
  }
}
