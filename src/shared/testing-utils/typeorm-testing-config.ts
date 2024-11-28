/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
import { BiteEntity } from '../../bite/bite.entity/bite.entity';
import { ClientEntity } from '../../client/client.entity/client.entity';
import { NotificationEntity } from '../../notification/notification.entity/notification.entity';
import { OrderEntity } from '../../order/order.entity/order.entity';
import { ProductEntity } from '../../product/product.entity/product.entity';
import { RestaurantEntity } from '../../restaurant/restaurant.entity/restaurant.entity';
import { ReviewEntity } from '../../review/review.entity/review.entity';
import { SubscriptionEntity } from '../../subscription/subscription.entity/subscription.entity';

export const TypeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [RestaurantEntity, OrderEntity, ClientEntity, ReviewEntity, SubscriptionEntity, NotificationEntity, BiteEntity, ProductEntity],
        synchronize: true
    }),
    TypeOrmModule.forFeature([RestaurantEntity, OrderEntity, ClientEntity, ReviewEntity, SubscriptionEntity, NotificationEntity, BiteEntity, ProductEntity]),
];
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/