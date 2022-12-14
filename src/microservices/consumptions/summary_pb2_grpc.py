# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc

import summary_pb2 as summary__pb2


class SummaryStub(object):
    """service which can be executed
    """

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.WeekSummary = channel.unary_unary(
                '/summary.Summary/WeekSummary',
                request_serializer=summary__pb2.SummaryRequest.SerializeToString,
                response_deserializer=summary__pb2.SummaryData.FromString,
                )
        self.MonthSummary = channel.unary_unary(
                '/summary.Summary/MonthSummary',
                request_serializer=summary__pb2.SummaryRequest.SerializeToString,
                response_deserializer=summary__pb2.SummaryData.FromString,
                )
        self.TotalSummary = channel.unary_unary(
                '/summary.Summary/TotalSummary',
                request_serializer=summary__pb2.SummaryRequest.SerializeToString,
                response_deserializer=summary__pb2.SummaryData.FromString,
                )


class SummaryServicer(object):
    """service which can be executed
    """

    def WeekSummary(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def MonthSummary(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def TotalSummary(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_SummaryServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'WeekSummary': grpc.unary_unary_rpc_method_handler(
                    servicer.WeekSummary,
                    request_deserializer=summary__pb2.SummaryRequest.FromString,
                    response_serializer=summary__pb2.SummaryData.SerializeToString,
            ),
            'MonthSummary': grpc.unary_unary_rpc_method_handler(
                    servicer.MonthSummary,
                    request_deserializer=summary__pb2.SummaryRequest.FromString,
                    response_serializer=summary__pb2.SummaryData.SerializeToString,
            ),
            'TotalSummary': grpc.unary_unary_rpc_method_handler(
                    servicer.TotalSummary,
                    request_deserializer=summary__pb2.SummaryRequest.FromString,
                    response_serializer=summary__pb2.SummaryData.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'summary.Summary', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class Summary(object):
    """service which can be executed
    """

    @staticmethod
    def WeekSummary(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/summary.Summary/WeekSummary',
            summary__pb2.SummaryRequest.SerializeToString,
            summary__pb2.SummaryData.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def MonthSummary(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/summary.Summary/MonthSummary',
            summary__pb2.SummaryRequest.SerializeToString,
            summary__pb2.SummaryData.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def TotalSummary(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/summary.Summary/TotalSummary',
            summary__pb2.SummaryRequest.SerializeToString,
            summary__pb2.SummaryData.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)
