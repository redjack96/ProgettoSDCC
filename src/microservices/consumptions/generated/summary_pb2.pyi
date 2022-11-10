from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor
Monthly: Period
Total: Period
Weekly: Period

class SummaryData(_message.Message):
    __slots__ = ["mostBoughtProduct", "mostUsedProduct", "numberExpired", "reference", "timesBought", "timesUsed"]
    MOSTBOUGHTPRODUCT_FIELD_NUMBER: _ClassVar[int]
    MOSTUSEDPRODUCT_FIELD_NUMBER: _ClassVar[int]
    NUMBEREXPIRED_FIELD_NUMBER: _ClassVar[int]
    REFERENCE_FIELD_NUMBER: _ClassVar[int]
    TIMESBOUGHT_FIELD_NUMBER: _ClassVar[int]
    TIMESUSED_FIELD_NUMBER: _ClassVar[int]
    mostBoughtProduct: str
    mostUsedProduct: str
    numberExpired: int
    reference: Period
    timesBought: int
    timesUsed: int
    def __init__(self, reference: _Optional[_Union[Period, str]] = ..., mostUsedProduct: _Optional[str] = ..., mostBoughtProduct: _Optional[str] = ..., timesUsed: _Optional[int] = ..., timesBought: _Optional[int] = ..., numberExpired: _Optional[int] = ...) -> None: ...

class SummaryRequest(_message.Message):
    __slots__ = []
    def __init__(self) -> None: ...

class Period(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = []
