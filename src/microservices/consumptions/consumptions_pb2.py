# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: consumptions.proto
"""Generated protocol buffer code."""
from google.protobuf.internal import builder as _builder
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


import shopping_list_pb2 as shopping__list__pb2


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x12\x63onsumptions.proto\x12\x0c\x63onsumptions\x1a\x13shopping_list.proto\"\x10\n\x0ePredictRequest\"C\n\x11PredictedDataList\x12.\n\tpredicted\x18\x01 \x03(\x0b\x32\x1b.consumptions.PredictedData\"T\n\x0cTrainRequest\x12/\n\x0cobservations\x18\x01 \x03(\x0b\x32\x19.consumptions.Observation\x12\x13\n\x0b\x63urrentDate\x18\x02 \x01(\x03\"\x8b\x01\n\x0bObservation\x12\x32\n\x0brequestType\x18\x01 \x01(\x0e\x32\x1d.consumptions.ObservationType\x12\x13\n\x0bproductName\x18\x02 \x01(\t\x12\x10\n\x08quantity\x18\x03 \x01(\x05\x12!\n\x04unit\x18\x04 \x01(\x0e\x32\x13.shopping_list.Unit\"C\n\rPredictedData\x12\x0c\n\x04week\x18\x01 \x01(\t\x12\x0f\n\x07product\x18\x02 \x01(\t\x12\x13\n\x0b\x63onsumption\x18\x03 \x01(\x02\"\x1c\n\rTrainResponse\x12\x0b\n\x03msg\x18\x01 \x01(\t*3\n\x0fObservationType\x12\t\n\x05\x61\x64\x64\x65\x64\x10\x00\x12\x08\n\x04used\x10\x01\x12\x0b\n\x07\x65xpired\x10\x02\x32\x9c\x01\n\tEstimator\x12H\n\x07Predict\x12\x1c.consumptions.PredictRequest\x1a\x1f.consumptions.PredictedDataList\x12\x45\n\nTrainModel\x12\x1a.consumptions.TrainRequest\x1a\x1b.consumptions.TrainResponseB\x13Z\x11.;proto_generatedb\x06proto3')

_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, globals())
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'consumptions_pb2', globals())
if _descriptor._USE_C_DESCRIPTORS == False:

  DESCRIPTOR._options = None
  DESCRIPTOR._serialized_options = b'Z\021.;proto_generated'
  _OBSERVATIONTYPE._serialized_start=471
  _OBSERVATIONTYPE._serialized_end=522
  _PREDICTREQUEST._serialized_start=57
  _PREDICTREQUEST._serialized_end=73
  _PREDICTEDDATALIST._serialized_start=75
  _PREDICTEDDATALIST._serialized_end=142
  _TRAINREQUEST._serialized_start=144
  _TRAINREQUEST._serialized_end=228
  _OBSERVATION._serialized_start=231
  _OBSERVATION._serialized_end=370
  _PREDICTEDDATA._serialized_start=372
  _PREDICTEDDATA._serialized_end=439
  _TRAINRESPONSE._serialized_start=441
  _TRAINRESPONSE._serialized_end=469
  _ESTIMATOR._serialized_start=525
  _ESTIMATOR._serialized_end=681
# @@protoc_insertion_point(module_scope)
