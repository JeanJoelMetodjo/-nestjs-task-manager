import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectRole } from '@prisma/client';

export class AddMemberDto {
  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ enum: ProjectRole, required: false, default: 'MEMBER' })
  @IsOptional()
  @IsEnum(ProjectRole)
  role?: ProjectRole;
}
