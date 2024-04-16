import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { CostsService } from './costs.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateCostDto } from './dto/create-cost.dto';
import { UpdateCostDto } from './dto/update-cost.dto';


@Controller('cost')
export class CostsController {
  constructor(private readonly costsService: CostsService, private authService: AuthService) {}

  @Get()   
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getAllCosts(@Req() req, @Res() res) {
    const token = req.token   

    const user = await this.authService.getUserByToken(token)   
    const costs = await this.costsService.findAll()   

    const filteredCosts = costs.filter((cost) => cost.userId === user._id.toString())

    return res.send(filteredCosts)
  }   

  @Post()   
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async createCost (@Body() createCostDto: CreateCostDto, @Req() req) {
    const user = await this.authService.getUserByToken(req.token)   

    return await this.costsService.createCost({
      ...createCostDto,   
      userId: user._id as string
    })
  }   

  @Patch(':id')   
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async updateCost (@Body() updateCostDto: UpdateCostDto, @Param('id') id: string) {

    return this.costsService.updateCost(updateCostDto, id)
  }   

  @Delete(':id')   
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async deleteCost (@Param('id') id: string) {

    return this.costsService.deleteCost(id)
  }

}
