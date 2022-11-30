from concurrent import futures

import consumptions
import persistence
import shopping_list_pb2
from consumptions import ConsumptionEstimator

import grpc
import consumptions_pb2
import consumptions_pb2_grpc
import properties as p

cassandra_conn: persistence.Cassandra
estimator: consumptions.ConsumptionEstimator
week_num: int = 0


def uniform_quantity_by_unit(unit, quantity):
    """
    Uniform all the units to the same unit (Grams)
    :param unit: the original unit
    :param quantity: the quantity value
    :return: the uniformed quantity
    """
    # uniforms quantity converting everything to Grams
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


# the gRPC server functions
class Estimator(consumptions_pb2_grpc.EstimatorServicer):

    # this is called by the frontend when asking the consumptions for all product in pantry
    def Predict(self, request: consumptions_pb2.PredictRequest, context):
        """
        Get the prediction values on request
        :param request: the prediction request
        :param context: the context
        :return: the list of the predictions
        """
        print("Received predict request")
        predicted = estimator.predict_consumptions()
        response = []
        for prod in predicted:
            week = predicted.get(prod).get("week")
            y_pred = predicted.get(prod).get("predicted")
            elem = consumptions_pb2.PredictedData(week=str(week), product=prod, consumption=y_pred)
            response.append(elem)
        print("RESPONSE: ", response)
        return consumptions_pb2.PredictedDataList(predicted=response)

    # this is called periodically by summary
    def TrainModel(self, item: consumptions_pb2.TrainRequest, context):
        """
        Training on-line of the models based on the observations collected during the last week
        :param item: the TrainRequest containing the observations collected
        :param context: the context
        :return: operation message
        """
        print("Received request with param: %s" % item.observations)
        global week_num
        # Save new observation data into persistence
        obs = item.observations
        week_num = week_num + 1  # increment the global week counter
        print("NEW WEEK: ", week_num)

        # sets the list of new products to []
        estimator.new_training()
        # for each product to train on
        for instance in obs:
            product_name = instance.productName
            # Add product to the product list variable in the estimator
            estimator.add_new_product(product_name)
            # Converts the product quantity to grams
            new_quantity = uniform_quantity_by_unit(instance.unit, instance.quantity)
            req_type = instance.requestType
            # Fills entry that are missing in the previous week with the same data as the last non-missing week
            cassandra_conn.fill_missing_entries(estimator.get_last_week_index(product_name), week_num, product_name)
            # updates the quantities
            cassandra_conn.update_quantity(week_num, product_name, new_quantity, req_type)
            # computes the features for the product and the week
            cassandra_conn.calculate_features_of_product(week_num, product_name)
            estimator.increment_week(product_name, week_num)  # Increment the last week registered ref
        # Re-train the model (only for last added elements)
        estimator.online_pipeline_training()
        return consumptions_pb2.TrainResponse(msg="model trained")


def serve(cassandra: persistence.Cassandra):
    # Set the global variable for the cassandra connection
    global cassandra_conn, estimator
    cassandra_conn = cassandra
    estimator = ConsumptionEstimator(cassandra)
    # Publish service
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    consumptions_pb2_grpc.add_EstimatorServicer_to_server(Estimator(), server)
    properties = p.Props()
    print(f"Python server started at port {properties.ConsumptionsPort}")
    server.add_insecure_port("[::]:" + str(properties.ConsumptionsPort))
    server.start()
    server.wait_for_termination()
