import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      select: ['id', 'name'],
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }

  async seed() {
    try {
      const count = await this.categoryRepository.count();

      if (count === 0) {
        const defaultCategories = [
          {
            name: 'Electronics',
            description: 'Devices, gadgets, and accessories',
          },
          { name: 'Fashion', description: 'Clothing, shoes, and accessories' },
          {
            name: 'Books',
            description: 'Printed and digital reading materials',
          },
          {
            name: 'Home & Kitchen',
            description: 'Furniture, appliances, and utensils',
          },
          {
            name: 'Sports',
            description: 'Equipment and apparel for sports and fitness',
          },
        ];

        await this.categoryRepository.save(defaultCategories);
        return { message: 'Categories seeded successfully' };
      } else {
        return { message: 'Categories already exist, skipping seed' };
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to seed categories: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
