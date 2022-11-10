from concurrent import futures

import grpc
import consumptions_pb2
import consumptions_pb2_grpc
import modules.properties as p


class Estimator(consumptions_pb2_grpc.EstimatorServicer):
    def Predict(self, request, context):
        print("Received request with param: %s" % request.name)
        return consumptions_pb2.PredictedDataList([])

    def TrainModel(self, request, context):
        print("Received request with param: %s" % request.name)
        return consumptions_pb2.TrainResponse(msg="model trained")


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    consumptions_pb2_grpc.add_EstimatorServicer_to_server(Estimator(), server)

    print(f"Python server started at port {p.Props.ConsumptionsPort}")
    server.add_insecure_port(f"[::]:{p.Props.ConsumptionsPort}")
    server.start()
    server.wait_for_termination()
