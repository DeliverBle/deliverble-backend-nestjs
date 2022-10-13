import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Script)
export class ScriptRepository extends Repository<Script> {
  
}
