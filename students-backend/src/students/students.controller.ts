import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {

constructor(private service:StudentsService){}

@Post()
create(@Body() body){
return this.service.create(body);
}

@Get()
findAll(){
return this.service.findAll();
}

@Get(':id')
findOne(@Param('id') id:number){
return this.service.findOne(id);
}

@Put(':id')
update(@Param('id') id:number,@Body() body){
return this.service.update(id,body);
}

@Delete(':id')
remove(@Param('id') id:number){
return this.service.remove(id);
}

}