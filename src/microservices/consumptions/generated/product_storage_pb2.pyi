import shopping_list_pb2 as _shopping_list_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class Date(_message.Message):
    __slots__ = ["day", "month", "year"]
    DAY_FIELD_NUMBER: _ClassVar[int]
    MONTH_FIELD_NUMBER: _ClassVar[int]
    YEAR_FIELD_NUMBER: _ClassVar[int]
    day: int
    month: int
    year: int
    def __init__(self, year: _Optional[int] = ..., month: _Optional[int] = ..., day: _Optional[int] = ...) -> None: ...

class Item(_message.Message):
    __slots__ = ["expiration", "itemId", "itemName", "lastUsed", "quantity", "timesIsBought", "totalUsedNumber", "type", "unit", "useNumber"]
    EXPIRATION_FIELD_NUMBER: _ClassVar[int]
    ITEMID_FIELD_NUMBER: _ClassVar[int]
    ITEMNAME_FIELD_NUMBER: _ClassVar[int]
    LASTUSED_FIELD_NUMBER: _ClassVar[int]
    QUANTITY_FIELD_NUMBER: _ClassVar[int]
    TIMESISBOUGHT_FIELD_NUMBER: _ClassVar[int]
    TOTALUSEDNUMBER_FIELD_NUMBER: _ClassVar[int]
    TYPE_FIELD_NUMBER: _ClassVar[int]
    UNIT_FIELD_NUMBER: _ClassVar[int]
    USENUMBER_FIELD_NUMBER: _ClassVar[int]
    expiration: _shopping_list_pb2.Timestamp
    itemId: int
    itemName: str
    lastUsed: int
    quantity: int
    timesIsBought: int
    totalUsedNumber: int
    type: _shopping_list_pb2.ProductType
    unit: _shopping_list_pb2.Unit
    useNumber: int
    def __init__(self, itemId: _Optional[int] = ..., itemName: _Optional[str] = ..., type: _Optional[_Union[_shopping_list_pb2.ProductType, str]] = ..., unit: _Optional[_Union[_shopping_list_pb2.Unit, str]] = ..., quantity: _Optional[int] = ..., expiration: _Optional[_Union[_shopping_list_pb2.Timestamp, _Mapping]] = ..., lastUsed: _Optional[int] = ..., useNumber: _Optional[int] = ..., totalUsedNumber: _Optional[int] = ..., timesIsBought: _Optional[int] = ...) -> None: ...

class ItemName(_message.Message):
    __slots__ = ["name"]
    NAME_FIELD_NUMBER: _ClassVar[int]
    name: str
    def __init__(self, name: _Optional[str] = ...) -> None: ...

class Pantry(_message.Message):
    __slots__ = ["products"]
    PRODUCTS_FIELD_NUMBER: _ClassVar[int]
    products: _containers.RepeatedCompositeFieldContainer[Item]
    def __init__(self, products: _Optional[_Iterable[_Union[Item, _Mapping]]] = ...) -> None: ...

class PantryMessage(_message.Message):
    __slots__ = []
    def __init__(self) -> None: ...

class UsedItem(_message.Message):
    __slots__ = ["itemType", "name", "quantity", "unit"]
    ITEMTYPE_FIELD_NUMBER: _ClassVar[int]
    NAME_FIELD_NUMBER: _ClassVar[int]
    QUANTITY_FIELD_NUMBER: _ClassVar[int]
    UNIT_FIELD_NUMBER: _ClassVar[int]
    itemType: _shopping_list_pb2.ProductType
    name: str
    quantity: int
    unit: _shopping_list_pb2.Unit
    def __init__(self, name: _Optional[str] = ..., quantity: _Optional[int] = ..., unit: _Optional[_Union[_shopping_list_pb2.Unit, str]] = ..., itemType: _Optional[_Union[_shopping_list_pb2.ProductType, str]] = ...) -> None: ...
