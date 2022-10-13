import { EntityRepository, Repository } from "typeorm";
import { ScriptExample } from "./script-example.entity";

@EntityRepository(ScriptExample)
export class ScriptExampleRepository extends Repository<ScriptExample> {
  
}
