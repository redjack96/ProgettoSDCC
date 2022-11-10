from google.protobuf.internal import containers as _containers
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union

Bottle: Unit
DESCRIPTOR: _descriptor.FileDescriptor
Drink: ProductType
Fish: ProductType
Fruit: ProductType
Grams: Unit
Kg: Unit
Meat: ProductType
Other: ProductType
Packet: Unit
Vegetable: ProductType

class BuyRequest(_message.Message):
    __slots__ = []
    def __init__(self) -> None: ...

class GetListRequest(_message.Message):
    __slots__ = []
    def __init__(self) -> None: ...

class ListId(_message.Message):
    __slots__ = ["listId"]
    LISTID_FIELD_NUMBER: _ClassVar[int]
    listId: int
    def __init__(self, listId: _Optional[int] = ...) -> None: ...

class Product(_message.Message):
    __slots__ = ["addedToCart", "checkedOut", "expiration", "productName", "quantity", "type", "unit"]
    ADDEDTOCART_FIELD_NUMBER: _ClassVar[int]
    CHECKEDOUT_FIELD_NUMBER: _ClassVar[int]
    EXPIRATION_FIELD_NUMBER: _ClassVar[int]
    PRODUCTNAME_FIELD_NUMBER: _ClassVar[int]
    QUANTITY_FIELD_NUMBER: _ClassVar[int]
    TYPE_FIELD_NUMBER: _ClassVar[int]
    UNIT_FIELD_NUMBER: _ClassVar[int]
    addedToCart: bool
    checkedOut: bool
    expiration: Timestamp
    productName: str
    quantity: int
    type: ProductType
    unit: Unit
    def __init__(self, productName: _Optional[str] = ..., type: _Optional[_Union[ProductType, str]] = ..., unit: _Optional[_Union[Unit, str]] = ..., quantity: _Optional[int] = ..., addedToCart: bool = ..., checkedOut: bool = ..., expiration: _Optional[_Union[Timestamp, _Mapping]] = ...) -> None: ...

class ProductKey(_message.Message):
    __slots__ = ["productName", "productType", "productUnit"]
    PRODUCTNAME_FIELD_NUMBER: _ClassVar[int]
    PRODUCTTYPE_FIELD_NUMBER: _ClassVar[int]
    PRODUCTUNIT_FIELD_NUMBER: _ClassVar[int]
    productName: str
    productType: int
    productUnit: int
    def __init__(self, productName: _Optional[str] = ..., productUnit: _Optional[int] = ..., productType: _Optional[int] = ...) -> None: ...

class ProductList(_message.Message):
    __slots__ = ["id", "name", "products"]
    ID_FIELD_NUMBER: _ClassVar[int]
    NAME_FIELD_NUMBER: _ClassVar[int]
    PRODUCTS_FIELD_NUMBER: _ClassVar[int]
    id: ListId
    name: str
    products: _containers.RepeatedCompositeFieldContainer[Product]
    def __init__(self, id: _Optional[_Union[ListId, _Mapping]] = ..., name: _Optional[str] = ..., products: _Optional[_Iterable[_Union[Product, _Mapping]]] = ...) -> None: ...

class ProductRemove(_message.Message):
    __slots__ = ["productName"]
    PRODUCTNAME_FIELD_NUMBER: _ClassVar[int]
    productName: str
    def __init__(self, productName: _Optional[str] = ...) -> None: ...

class ProductUpdate(_message.Message):
    __slots__ = ["field", "productId", "value"]
    FIELD_FIELD_NUMBER: _ClassVar[int]
    PRODUCTID_FIELD_NUMBER: _ClassVar[int]
    VALUE_FIELD_NUMBER: _ClassVar[int]
    field: str
    productId: str
    value: str
    def __init__(self, productId: _Optional[str] = ..., field: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...

class Response(_message.Message):
    __slots__ = ["msg"]
    MSG_FIELD_NUMBER: _ClassVar[int]
    msg: str
    def __init__(self, msg: _Optional[str] = ...) -> None: ...

class Timestamp(_message.Message):
    __slots__ = ["nanos", "seconds"]
    NANOS_FIELD_NUMBER: _ClassVar[int]
    SECONDS_FIELD_NUMBER: _ClassVar[int]
    nanos: int
    seconds: int
    def __init__(self, seconds: _Optional[int] = ..., nanos: _Optional[int] = ...) -> None: ...

class ProductType(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = []

class Unit(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = []
