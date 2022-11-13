from concurrent import futures

import persistence
import shopping_list_pb2
from consumptions import ConsumptionEstimator

import grpc
import consumptions_pb2
import consumptions_pb2_grpc
import properties as p
import product_storage_pb2

cassandra: persistence.Cassandra


def uniform_quantity_by_unit(unit, quantity):
    # uniform quantity converting everything to Grams
    if unit == shopping_list_pb2.Kg:
        # 1 Kg = 1000 Grams
        new_quantity = quantity * 1000
    elif unit == shopping_list_pb2.Bottle:
        # 1 Bottle = 1l = 1Kg = 1000 Grams
        new_quantity = quantity * 1000
    elif unit == shopping_list_pb2.Packet:
        # By default 1 Packet = 500 Grams
        new_quantity = quantity * 500
    else:  # is already Grams
        new_quantity = quantity
    return new_quantity


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
        obs = item.observations
        for instance in obs:
            week_num = 1  # FIXME fare in modo di recuperare la settimana giusta
            new_quantity = uniform_quantity_by_unit(instance.unit, instance.quantity)
            product_name = instance.productName
            req_type = instance.requestType
            if cassandra is not None:
                cassandra.update_entry(week_num, product_name, new_quantity, req_type)
            else:
                print("Cassandra is none")
        return consumptions_pb2.TrainResponse(msg="model trained")


def serve(cassandra_conn: persistence.Cassandra):
    # Set global variable for Cassandra connection
    global cassandra
    cassandra = cassandra_conn
    # Publish service
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    consumptions_pb2_grpc.add_EstimatorServicer_to_server(Estimator(), server)
    properties = p.Props()
    print(f"Python server started at port {properties.ConsumptionsPort}")
    server.add_insecure_port("[::]:" + str(properties.ConsumptionsPort))
    server.start()
    server.wait_for_termination()
