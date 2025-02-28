import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  NotFoundException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PromptGeneratorService } from '../services/prompt_generator.service';
import { CustomLogging } from '../../logging/custom-logging';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { ApiKeyAuthGuard } from '../../auth/guard/api-key-auth.guard';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { Generation } from '../entities/generation.entity';
import { GenerationsService } from '../services/generations.service';
import { LocationsService } from '../../locations/locations.service';
import { CreateGenerationDto } from '../dto/create-generation.dto';
import { UsersService } from '../../users/users.service';
import { LastGeneration } from '../../users/entities/lastGeneration.entity';

@UseGuards(ApiKeyAuthGuard, JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiBearerAuth('ApiKey')
@Controller({
  version: '1',
  path: 'locations/:locationId/generations',
})
export class GenerationController {
  private readonly logger = new CustomLogging(GenerationController.name);
  constructor(
    @Inject(PromptGeneratorService)
    private readonly promptGenerationService: PromptGeneratorService,
    @Inject(GenerationsService)
    private readonly generationService: GenerationsService,
    @Inject(LocationsService)
    private readonly locationService: LocationsService,
    @Inject(UsersService) private readonly userService: UsersService,
  ) {}

  @ApiParam({ name: 'locationId', type: String })
  @ApiBody({ type: CreateGenerationDto })
  @Post()
  async getGeneration(
    @Request() request,
    @Param('locationId') locationId: string,
    @Body() createGeneration: CreateGenerationDto,
  ): Promise<Generation> {
    let generation: Generation | null = null;
    const appUser = request.user;
    locationId = decodeURIComponent(locationId);
    console.log(locationId);
    this.logger.log('Getting user data');
    const user = await this.userService.findOne(appUser.id);

    this.logger.log('Checking if the user can generate an image');
    const canGenerate = user.canGenerateImage();
    if (!canGenerate) {
      this.logger.log('User can not generate an image');
      //Throw a 429 exception Too Many Requests
      throw new HttpException(
        'You have reached the maximum number of generations per day',
        429,
      );
    }

    this.logger.log('Checking if the location exists');
    const location = await this.locationService.findOne(locationId, user.id);
    if (!location) {
      this.logger.log('Location does not exist');
      throw new NotFoundException(
        `Location with id ${locationId} does not exist`,
      );
    }
    this.logger.log('Generating prompt');
    let imageStyle = '';
    if (user.styles !== undefined && user.styles.length !== 0) {
      this.logger.log(`User style: ${user.styles}`);
      imageStyle = `${user.styles.join(', ')}`;
    }
    const prompt = await this.promptGenerationService.generatePrompt(
      imageStyle,
      createGeneration.time,
      location.city,
      createGeneration.weather,
    );
    this.logger.log('Starting image generation');
    generation = await this.generationService.create(
      null,
      user.id,
      location.id,
      prompt,
    );
    console.log(`Generation ID : ${generation.id}`);
    if (generation) {
      this.logger.log(
        'Inserting generation ID in user data : lastGenerationsIdAsc',
      );
      user.addGenerationId(
        new LastGeneration(generation.id, generation.createdAt),
      );
      this.logger.log('Updating user data');
      await this.userService.update(user);
    }
    return generation;
  }
}
