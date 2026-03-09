import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';

@Injectable()
export class StudentsService {

constructor(
@InjectRepository(Student)
private repo: Repository<Student>
){}

create(data){
return this.repo.save(data);
}

findAll(){
return this.repo.find();
}

findOne(id:number){
return this.repo.findOneBy({id});
}

update(id:number,data){
return this.repo.update(id,data);
}

remove(id:number){
return this.repo.delete(id);
}

}