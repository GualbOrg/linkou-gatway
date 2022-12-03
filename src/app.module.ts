import { GraphQLDataSourceProcessOptions, IntrospectAndCompose, RemoteGraphQLDataSource, ServiceEndpointDefinition } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';

import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';


type RequestType = { req: Request, res: Response }
class AuthenticatedDataSource extends RemoteGraphQLDataSource {


  willSendRequest({ request, context }: GraphQLDataSourceProcessOptions<Record<string, any>>) {
    if (context['req']) {
      console.log('hits is request')
      request?.http?.headers.set('x-api-key', process.env.X_API_KEY as string);
      request?.http?.headers.set('authorization', context['req']['headers']['authorization']);
    }
  }
}
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        context: ({ req, res }: RequestType) => ({ req, res }),
        cors: true,
      },
      gateway: {
        buildService({ url }: ServiceEndpointDefinition) {
          return new AuthenticatedDataSource({ url });
        },
        serviceList: [
          { name: 'profile', url: process.env.PROFILE_API, },
          { name: 'businessProfile', url: process.env.OCUPATION_AREA_PROFILE },
        ],
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'profile', url: process.env.PROFILE_API, },
            { name: 'businessProfile', url: process.env.OCUPATION_AREA_PROFILE },
          ],
          introspectionHeaders() {
            return {
              'x-api-key': process.env.X_API_KEY as string
            }
          },
        }),
      },
    }),
  ]

})
export class AppModule { }
