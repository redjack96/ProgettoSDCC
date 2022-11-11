from concurrent import futures
from consumptions import ConsumptionEstimator

import grpc
import consumptions_pb2
import consumptions_pb2_grpc
import properties as p
import os
import product_storage_pb2


class Estimator(consumptions_pb2_grpc.EstimatorServicer):
    def Predict(self, request: consumptions_pb2.PredictRequest, context):
        print("Received predict request")
        estimator = ConsumptionEstimator()
        predicted = estimator.predict_consumptions()
        response = []
        for prod in predicted:
            week = predicted.get(prod).get("week")
            y_pred = predicted.get(prod).get("predicted")
            elem = consumptions_pb2.PredictedData(week=str(week), product=prod, consumption=y_pred)
            response.append(elem)
        print("RESPONSE: ", response)
        return consumptions_pb2.PredictedDataList(predicted=response)

    def TrainModel(self, item: product_storage_pb2.Item, context):
        print("Received request with param: %s" % item.itemName)
        return consumptions_pb2.TrainResponse(msg="model trained")


def serve():
    print(os.listdir("modules"))  # returns list
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    consumptions_pb2_grpc.add_EstimatorServicer_to_server(Estimator(), server)
    properties = p.Props()
    print(f"Python server started at port {properties.ConsumptionsPort}")
    server.add_insecure_port("[::]:" + str(properties.ConsumptionsPort))
    server.start()
    server.wait_for_termination()
