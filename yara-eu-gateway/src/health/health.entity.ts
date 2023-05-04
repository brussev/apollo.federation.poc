import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
class Info {
    @Field()
    status: string;
}

@ObjectType()
class HealthInfo {
    @Field(() => Info)
    heap: Info;
}

@ObjectType()
export class Health {
    @Field()
    status: string;

    @Field(() => HealthInfo)
    info: HealthInfo;
}
