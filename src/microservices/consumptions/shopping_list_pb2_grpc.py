# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc

import shopping_list_pb2 as shopping__list__pb2


class ShoppingListStub(object):
    """service which can be executed
    Important: each method can have only one input and one output!!!
    """

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.AddProductToList = channel.unary_unary(
                '/shopping_list.ShoppingList/AddProductToList',
                request_serializer=shopping__list__pb2.Product.SerializeToString,
                response_deserializer=shopping__list__pb2.Response.FromString,
                )
        self.RemoveProductFromList = channel.unary_unary(
                '/shopping_list.ShoppingList/RemoveProductFromList',
                request_serializer=shopping__list__pb2.ProductKey.SerializeToString,
                response_deserializer=shopping__list__pb2.Response.FromString,
                )
        self.UpdateProductInList = channel.unary_unary(
                '/shopping_list.ShoppingList/UpdateProductInList',
                request_serializer=shopping__list__pb2.ProductUpdate.SerializeToString,
                response_deserializer=shopping__list__pb2.Response.FromString,
                )
        self.AddProductToCart = channel.unary_unary(
                '/shopping_list.ShoppingList/AddProductToCart',
                request_serializer=shopping__list__pb2.ProductKey.SerializeToString,
                response_deserializer=shopping__list__pb2.Response.FromString,
                )
        self.RemoveProductFromCart = channel.unary_unary(
                '/shopping_list.ShoppingList/RemoveProductFromCart',
                request_serializer=shopping__list__pb2.ProductKey.SerializeToString,
                response_deserializer=shopping__list__pb2.Response.FromString,
                )
        self.GetList = channel.unary_unary(
                '/shopping_list.ShoppingList/GetList',
                request_serializer=shopping__list__pb2.GetListRequest.SerializeToString,
                response_deserializer=shopping__list__pb2.ProductList.FromString,
                )
        self.BuyAllProductsInCart = channel.unary_unary(
                '/shopping_list.ShoppingList/BuyAllProductsInCart',
                request_serializer=shopping__list__pb2.BuyRequest.SerializeToString,
                response_deserializer=shopping__list__pb2.Response.FromString,
                )


class ShoppingListServicer(object):
    """service which can be executed
    Important: each method can have only one input and one output!!!
    """

    def AddProductToList(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def RemoveProductFromList(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def UpdateProductInList(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def AddProductToCart(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def RemoveProductFromCart(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def GetList(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def BuyAllProductsInCart(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_ShoppingListServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'AddProductToList': grpc.unary_unary_rpc_method_handler(
                    servicer.AddProductToList,
                    request_deserializer=shopping__list__pb2.Product.FromString,
                    response_serializer=shopping__list__pb2.Response.SerializeToString,
            ),
            'RemoveProductFromList': grpc.unary_unary_rpc_method_handler(
                    servicer.RemoveProductFromList,
                    request_deserializer=shopping__list__pb2.ProductKey.FromString,
                    response_serializer=shopping__list__pb2.Response.SerializeToString,
            ),
            'UpdateProductInList': grpc.unary_unary_rpc_method_handler(
                    servicer.UpdateProductInList,
                    request_deserializer=shopping__list__pb2.ProductUpdate.FromString,
                    response_serializer=shopping__list__pb2.Response.SerializeToString,
            ),
            'AddProductToCart': grpc.unary_unary_rpc_method_handler(
                    servicer.AddProductToCart,
                    request_deserializer=shopping__list__pb2.ProductKey.FromString,
                    response_serializer=shopping__list__pb2.Response.SerializeToString,
            ),
            'RemoveProductFromCart': grpc.unary_unary_rpc_method_handler(
                    servicer.RemoveProductFromCart,
                    request_deserializer=shopping__list__pb2.ProductKey.FromString,
                    response_serializer=shopping__list__pb2.Response.SerializeToString,
            ),
            'GetList': grpc.unary_unary_rpc_method_handler(
                    servicer.GetList,
                    request_deserializer=shopping__list__pb2.GetListRequest.FromString,
                    response_serializer=shopping__list__pb2.ProductList.SerializeToString,
            ),
            'BuyAllProductsInCart': grpc.unary_unary_rpc_method_handler(
                    servicer.BuyAllProductsInCart,
                    request_deserializer=shopping__list__pb2.BuyRequest.FromString,
                    response_serializer=shopping__list__pb2.Response.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'shopping_list.ShoppingList', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class ShoppingList(object):
    """service which can be executed
    Important: each method can have only one input and one output!!!
    """

    @staticmethod
    def AddProductToList(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/shopping_list.ShoppingList/AddProductToList',
            shopping__list__pb2.Product.SerializeToString,
            shopping__list__pb2.Response.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def RemoveProductFromList(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/shopping_list.ShoppingList/RemoveProductFromList',
            shopping__list__pb2.ProductKey.SerializeToString,
            shopping__list__pb2.Response.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def UpdateProductInList(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/shopping_list.ShoppingList/UpdateProductInList',
            shopping__list__pb2.ProductUpdate.SerializeToString,
            shopping__list__pb2.Response.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def AddProductToCart(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/shopping_list.ShoppingList/AddProductToCart',
            shopping__list__pb2.ProductKey.SerializeToString,
            shopping__list__pb2.Response.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def RemoveProductFromCart(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/shopping_list.ShoppingList/RemoveProductFromCart',
            shopping__list__pb2.ProductKey.SerializeToString,
            shopping__list__pb2.Response.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def GetList(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/shopping_list.ShoppingList/GetList',
            shopping__list__pb2.GetListRequest.SerializeToString,
            shopping__list__pb2.ProductList.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def BuyAllProductsInCart(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/shopping_list.ShoppingList/BuyAllProductsInCart',
            shopping__list__pb2.BuyRequest.SerializeToString,
            shopping__list__pb2.Response.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)
