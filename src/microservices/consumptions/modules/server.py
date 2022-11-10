from concurrent import futures

import grpc
import consumptions_pb2
import consumptions_pb2_grpc
import modules.properties as p
import os

import product_storage_pb2


class Estimator(consumptions_pb2_grpc.EstimatorServicer):
    def Predict(self, request: consumptions_pb2.PredictRequest, context):
        print("Received predict request")
        return consumptions_pb2.PredictedDataList(predicted=[])

    def TrainModel(self, item: product_storage_pb2.Item, context):
        print("Received request with param: %s" % item.itemName)
        return consumptions_pb2.TrainResponse(msg="model trained")


def serve():
    print(os.listdir("."))  # returns list
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    consumptions_pb2_grpc.add_EstimatorServicer_to_server(Estimator(), server)
    properties = p.Props()
    print(f"Python server started at port {properties.ConsumptionsPort}")
    server.add_insecure_port("[::]:" + str(properties.ConsumptionsPort))
    server.start()
    server.wait_for_termination()
