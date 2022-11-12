from concurrent import futures
from consumptions import ConsumptionEstimator

import grpc
import consumptions_pb2
import consumptions_pb2_grpc
import properties as p
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

    def TrainModel(self, item: consumptions_pb2.TrainRequest, context):
        print("I'm here")
        print("Received request with param: %s" % item.observations)

        # Save new observation data into persistence
        # todo
        return consumptions_pb2.TrainResponse(msg="model trained")


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    consumptions_pb2_grpc.add_EstimatorServicer_to_server(Estimator(), server)
    properties = p.Props()
    print(f"Python server started at port {properties.ConsumptionsPort}")
    server.add_insecure_port("[::]:" + str(properties.ConsumptionsPort))
    server.start()
    server.wait_for_termination()
