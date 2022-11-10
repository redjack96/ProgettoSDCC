from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class Ingredient(_message.Message):
    __slots__ = ["name"]
    NAME_FIELD_NUMBER: _ClassVar[int]
    name: str
    def __init__(self, name: _Optional[str] = ...) -> None: ...

class IngredientsList(_message.Message):
    __slots__ = ["ingredientsList"]
    INGREDIENTSLIST_FIELD_NUMBER: _ClassVar[int]
    ingredientsList: _containers.RepeatedCompositeFieldContainer[Ingredient]
    def __init__(self, ingredientsList: _Optional[_Iterable[_Union[Ingredient, _Mapping]]] = ...) -> None: ...

class Recipe(_message.Message):
    __slots__ = ["id", "missedIngredients", "title", "url", "usedIngredients"]
    ID_FIELD_NUMBER: _ClassVar[int]
    MISSEDINGREDIENTS_FIELD_NUMBER: _ClassVar[int]
    TITLE_FIELD_NUMBER: _ClassVar[int]
    URL_FIELD_NUMBER: _ClassVar[int]
    USEDINGREDIENTS_FIELD_NUMBER: _ClassVar[int]
    id: str
    missedIngredients: _containers.RepeatedCompositeFieldContainer[Ingredient]
    title: str
    url: str
    usedIngredients: _containers.RepeatedCompositeFieldContainer[Ingredient]
    def __init__(self, id: _Optional[str] = ..., title: _Optional[str] = ..., url: _Optional[str] = ..., usedIngredients: _Optional[_Iterable[_Union[Ingredient, _Mapping]]] = ..., missedIngredients: _Optional[_Iterable[_Union[Ingredient, _Mapping]]] = ...) -> None: ...

class RecipeList(_message.Message):
    __slots__ = ["recipes"]
    RECIPES_FIELD_NUMBER: _ClassVar[int]
    recipes: _containers.RepeatedCompositeFieldContainer[Recipe]
    def __init__(self, recipes: _Optional[_Iterable[_Union[Recipe, _Mapping]]] = ...) -> None: ...

class RecipesRequest(_message.Message):
    __slots__ = []
    def __init__(self) -> None: ...
