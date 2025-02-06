import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { title } from 'process';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository:Repository<Transaction>
  ) {}

  async create(createTransactionDto: CreateTransactionDto, id: number) {
    const newTransaction = {
      title: createTransactionDto.title,
      amount: createTransactionDto.amount,
      type: createTransactionDto.type,
      user: {id},
      category:{id: +createTransactionDto.category},
    }
   if(!newTransaction){
    throw new BadRequestException('Transaction not created')
   }
    

  return await this.transactionRepository.save(newTransaction)
  }

  async findAll(id: number) {
    const transactions = await this.transactionRepository.find({where:{user:{id}}, order:{createdAt:'DESC'}})
    return transactions
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where:{id},
      relations:['category', 'user']
    })
    if(!transaction){
      throw new BadRequestException('Transaction not found')
    }
    return transaction
  }
    

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  async remove(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where:{id}
    })
    if(!transaction){
      throw new BadRequestException('Transaction not found')
    }
    return await this.transactionRepository.delete(id)
  }
}
