from google.protobuf.internal import containers as _containers
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor
added: ObservationType
expired: ObservationType
used: ObservationType

class Observation(_message.Message):
    __slots__ = ["productName", "quantity", "requestType"]
    PRODUCTNAME_FIELD_NUMBER: _ClassVar[int]
    QUANTITY_FIELD_NUMBER: _ClassVar[int]
    REQUESTTYPE_FIELD_NUMBER: _ClassVar[int]
    productName: str
    quantity: int
    requestType: ObservationType
    def __init__(self, requestType: _Optional[_Union[ObservationType, str]] = ..., productName: _Optional[str] = ..., quantity: _Optional[int] = ...) -> None: ...

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

class TrainRequest(_message.Message):
    __slots__ = ["currentDate", "observations"]
    CURRENTDATE_FIELD_NUMBER: _ClassVar[int]
    OBSERVATIONS_FIELD_NUMBER: _ClassVar[int]
    currentDate: int
    observations: _containers.RepeatedCompositeFieldContainer[Observation]
    def __init__(self, observations: _Optional[_Iterable[_Union[Observation, _Mapping]]] = ..., currentDate: _Optional[int] = ...) -> None: ...

class TrainResponse(_message.Message):
    __slots__ = ["msg"]
    MSG_FIELD_NUMBER: _ClassVar[int]
    msg: str
    def __init__(self, msg: _Optional[str] = ...) -> None: ...

class ObservationType(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = []
