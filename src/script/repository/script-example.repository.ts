import { EntityRepository, Repository } from "typeorm";
import { ScriptExample } from "../entity/script-example.entity";

@EntityRepository(ScriptExample)
export class ScriptExampleRepository extends Repository<ScriptExample> {
  
}
