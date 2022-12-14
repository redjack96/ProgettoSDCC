# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc

import recipes_pb2 as recipes__pb2


class RecipesStub(object):
    """Services that can be executed
    """

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.GetRecipesFromIngredients = channel.unary_unary(
                '/recipes.Recipes/GetRecipesFromIngredients',
                request_serializer=recipes__pb2.IngredientsList.SerializeToString,
                response_deserializer=recipes__pb2.RecipeList.FromString,
                )
        self.GetRecipesFromPantry = channel.unary_unary(
                '/recipes.Recipes/GetRecipesFromPantry',
                request_serializer=recipes__pb2.RecipesRequest.SerializeToString,
                response_deserializer=recipes__pb2.RecipeList.FromString,
                )


class RecipesServicer(object):
    """Services that can be executed
    """

    def GetRecipesFromIngredients(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def GetRecipesFromPantry(self, request, context):
        """need to redirect request to storage to get pantry
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_RecipesServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'GetRecipesFromIngredients': grpc.unary_unary_rpc_method_handler(
                    servicer.GetRecipesFromIngredients,
                    request_deserializer=recipes__pb2.IngredientsList.FromString,
                    response_serializer=recipes__pb2.RecipeList.SerializeToString,
            ),
            'GetRecipesFromPantry': grpc.unary_unary_rpc_method_handler(
                    servicer.GetRecipesFromPantry,
                    request_deserializer=recipes__pb2.RecipesRequest.FromString,
                    response_serializer=recipes__pb2.RecipeList.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'recipes.Recipes', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class Recipes(object):
    """Services that can be executed
    """

    @staticmethod
    def GetRecipesFromIngredients(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/recipes.Recipes/GetRecipesFromIngredients',
            recipes__pb2.IngredientsList.SerializeToString,
            recipes__pb2.RecipeList.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def GetRecipesFromPantry(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/recipes.Recipes/GetRecipesFromPantry',
            recipes__pb2.RecipesRequest.SerializeToString,
            recipes__pb2.RecipeList.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)
