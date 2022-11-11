import product_storage_pb2 as _product_storage_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class PredictRequest(_message.Message):
    __slots__ = []
    def __init__(self) -> None: ...

class PredictedData(_message.Message):
    __slots__ = ["consumption", "product", "week"]
    CONSUMPTION_FIELD_NUMBER: _ClassVar[int]
    PRODUCT_FIELD_NUMBER: _ClassVar[int]
    WEEK_FIELD_NUMBER: _ClassVar[int]
    consumption: float
    product: str
    week: str
    def __init__(self, week: _Optional[str] = ..., product: _Optional[str] = ..., consumption: _Optional[float] = ...) -> None: ...

class PredictedDataList(_message.Message):
    __slots__ = ["predicted"]
    PREDICTED_FIELD_NUMBER: _ClassVar[int]
    predicted: _containers.RepeatedCompositeFieldContainer[PredictedData]
    def __init__(self, predicted: _Optional[_Iterable[_Union[PredictedData, _Mapping]]] = ...) -> None: ...

class TrainResponse(_message.Message):
    __slots__ = ["msg"]
    MSG_FIELD_NUMBER: _ClassVar[int]
    msg: str
    def __init__(self, msg: _Optional[str] = ...) -> None: ...
