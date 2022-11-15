from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class NotificationList(_message.Message):
    __slots__ = ["notification"]
    NOTIFICATION_FIELD_NUMBER: _ClassVar[int]
    notification: _containers.RepeatedScalarFieldContainer[str]
    def __init__(self, notification: _Optional[_Iterable[str]] = ...) -> None: ...

class NotificationRequest(_message.Message):
    __slots__ = []
    def __init__(self) -> None: ...
