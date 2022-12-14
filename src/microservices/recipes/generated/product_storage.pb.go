// version of protocol buffer used

// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.28.1
// 	protoc        v3.15.8
// source: product_storage.proto

// package name for the buffer will be used later

package proto_generated

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type ItemName struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Name string `protobuf:"bytes,1,opt,name=name,proto3" json:"name,omitempty"`
}

func (x *ItemName) Reset() {
	*x = ItemName{}
	if protoimpl.UnsafeEnabled {
		mi := &file_product_storage_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ItemName) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ItemName) ProtoMessage() {}

func (x *ItemName) ProtoReflect() protoreflect.Message {
	mi := &file_product_storage_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ItemName.ProtoReflect.Descriptor instead.
func (*ItemName) Descriptor() ([]byte, []int) {
	return file_product_storage_proto_rawDescGZIP(), []int{0}
}

func (x *ItemName) GetName() string {
	if x != nil {
		return x.Name
	}
	return ""
}

type Date struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// [1-9999]
	Year int32 `protobuf:"varint,1,opt,name=year,proto3" json:"year,omitempty"` // messages start from 1
	// [1-12]
	Month int32 `protobuf:"varint,2,opt,name=month,proto3" json:"month,omitempty"`
	// [1-31]
	Day int32 `protobuf:"varint,3,opt,name=day,proto3" json:"day,omitempty"`
}

func (x *Date) Reset() {
	*x = Date{}
	if protoimpl.UnsafeEnabled {
		mi := &file_product_storage_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Date) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Date) ProtoMessage() {}

func (x *Date) ProtoReflect() protoreflect.Message {
	mi := &file_product_storage_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Date.ProtoReflect.Descriptor instead.
func (*Date) Descriptor() ([]byte, []int) {
	return file_product_storage_proto_rawDescGZIP(), []int{1}
}

func (x *Date) GetYear() int32 {
	if x != nil {
		return x.Year
	}
	return 0
}

func (x *Date) GetMonth() int32 {
	if x != nil {
		return x.Month
	}
	return 0
}

func (x *Date) GetDay() int32 {
	if x != nil {
		return x.Day
	}
	return 0
}

// argument
type Item struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	ItemId          int64       `protobuf:"varint,1,opt,name=itemId,proto3" json:"itemId,omitempty"`
	ItemName        string      `protobuf:"bytes,2,opt,name=itemName,proto3" json:"itemName,omitempty"`
	Type            ProductType `protobuf:"varint,3,opt,name=type,proto3,enum=shopping_list.ProductType" json:"type,omitempty"`
	Unit            Unit        `protobuf:"varint,4,opt,name=unit,proto3,enum=shopping_list.Unit" json:"unit,omitempty"`
	Quantity        int32       `protobuf:"varint,5,opt,name=quantity,proto3" json:"quantity,omitempty"`
	Expiration      *Timestamp  `protobuf:"bytes,6,opt,name=expiration,proto3" json:"expiration,omitempty"`
	LastUsed        int64       `protobuf:"varint,7,opt,name=lastUsed,proto3" json:"lastUsed,omitempty"`
	UseNumber       int32       `protobuf:"varint,8,opt,name=useNumber,proto3" json:"useNumber,omitempty"`             // times the item is used
	TotalUsedNumber int32       `protobuf:"varint,9,opt,name=totalUsedNumber,proto3" json:"totalUsedNumber,omitempty"` // times
	TimesIsBought   int32       `protobuf:"varint,10,opt,name=timesIsBought,proto3" json:"timesIsBought,omitempty"`
}

func (x *Item) Reset() {
	*x = Item{}
	if protoimpl.UnsafeEnabled {
		mi := &file_product_storage_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Item) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Item) ProtoMessage() {}

func (x *Item) ProtoReflect() protoreflect.Message {
	mi := &file_product_storage_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Item.ProtoReflect.Descriptor instead.
func (*Item) Descriptor() ([]byte, []int) {
	return file_product_storage_proto_rawDescGZIP(), []int{2}
}

func (x *Item) GetItemId() int64 {
	if x != nil {
		return x.ItemId
	}
	return 0
}

func (x *Item) GetItemName() string {
	if x != nil {
		return x.ItemName
	}
	return ""
}

func (x *Item) GetType() ProductType {
	if x != nil {
		return x.Type
	}
	return ProductType_Meat
}

func (x *Item) GetUnit() Unit {
	if x != nil {
		return x.Unit
	}
	return Unit_Bottle
}

func (x *Item) GetQuantity() int32 {
	if x != nil {
		return x.Quantity
	}
	return 0
}

func (x *Item) GetExpiration() *Timestamp {
	if x != nil {
		return x.Expiration
	}
	return nil
}

func (x *Item) GetLastUsed() int64 {
	if x != nil {
		return x.LastUsed
	}
	return 0
}

func (x *Item) GetUseNumber() int32 {
	if x != nil {
		return x.UseNumber
	}
	return 0
}

func (x *Item) GetTotalUsedNumber() int32 {
	if x != nil {
		return x.TotalUsedNumber
	}
	return 0
}

func (x *Item) GetTimesIsBought() int32 {
	if x != nil {
		return x.TimesIsBought
	}
	return 0
}

type Pantry struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Products []*Item `protobuf:"bytes,1,rep,name=products,proto3" json:"products,omitempty"` // list of products
}

func (x *Pantry) Reset() {
	*x = Pantry{}
	if protoimpl.UnsafeEnabled {
		mi := &file_product_storage_proto_msgTypes[3]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Pantry) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Pantry) ProtoMessage() {}

func (x *Pantry) ProtoReflect() protoreflect.Message {
	mi := &file_product_storage_proto_msgTypes[3]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Pantry.ProtoReflect.Descriptor instead.
func (*Pantry) Descriptor() ([]byte, []int) {
	return file_product_storage_proto_rawDescGZIP(), []int{3}
}

func (x *Pantry) GetProducts() []*Item {
	if x != nil {
		return x.Products
	}
	return nil
}

type UsedItem struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Name     string      `protobuf:"bytes,1,opt,name=name,proto3" json:"name,omitempty"`
	Quantity int32       `protobuf:"varint,2,opt,name=quantity,proto3" json:"quantity,omitempty"`
	Unit     Unit        `protobuf:"varint,3,opt,name=unit,proto3,enum=shopping_list.Unit" json:"unit,omitempty"`
	ItemType ProductType `protobuf:"varint,4,opt,name=itemType,proto3,enum=shopping_list.ProductType" json:"itemType,omitempty"`
}

func (x *UsedItem) Reset() {
	*x = UsedItem{}
	if protoimpl.UnsafeEnabled {
		mi := &file_product_storage_proto_msgTypes[4]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *UsedItem) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*UsedItem) ProtoMessage() {}

func (x *UsedItem) ProtoReflect() protoreflect.Message {
	mi := &file_product_storage_proto_msgTypes[4]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use UsedItem.ProtoReflect.Descriptor instead.
func (*UsedItem) Descriptor() ([]byte, []int) {
	return file_product_storage_proto_rawDescGZIP(), []int{4}
}

func (x *UsedItem) GetName() string {
	if x != nil {
		return x.Name
	}
	return ""
}

func (x *UsedItem) GetQuantity() int32 {
	if x != nil {
		return x.Quantity
	}
	return 0
}

func (x *UsedItem) GetUnit() Unit {
	if x != nil {
		return x.Unit
	}
	return Unit_Bottle
}

func (x *UsedItem) GetItemType() ProductType {
	if x != nil {
		return x.ItemType
	}
	return ProductType_Meat
}

type PantryMessage struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields
}

func (x *PantryMessage) Reset() {
	*x = PantryMessage{}
	if protoimpl.UnsafeEnabled {
		mi := &file_product_storage_proto_msgTypes[5]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *PantryMessage) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*PantryMessage) ProtoMessage() {}

func (x *PantryMessage) ProtoReflect() protoreflect.Message {
	mi := &file_product_storage_proto_msgTypes[5]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use PantryMessage.ProtoReflect.Descriptor instead.
func (*PantryMessage) Descriptor() ([]byte, []int) {
	return file_product_storage_proto_rawDescGZIP(), []int{5}
}

var File_product_storage_proto protoreflect.FileDescriptor

var file_product_storage_proto_rawDesc = []byte{
	0x0a, 0x15, 0x70, 0x72, 0x6f, 0x64, 0x75, 0x63, 0x74, 0x5f, 0x73, 0x74, 0x6f, 0x72, 0x61, 0x67,
	0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x0f, 0x70, 0x72, 0x6f, 0x64, 0x75, 0x63, 0x74,
	0x5f, 0x73, 0x74, 0x6f, 0x72, 0x61, 0x67, 0x65, 0x1a, 0x13, 0x73, 0x68, 0x6f, 0x70, 0x70, 0x69,
	0x6e, 0x67, 0x5f, 0x6c, 0x69, 0x73, 0x74, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x22, 0x1e, 0x0a,
	0x08, 0x49, 0x74, 0x65, 0x6d, 0x4e, 0x61, 0x6d, 0x65, 0x12, 0x12, 0x0a, 0x04, 0x6e, 0x61, 0x6d,
	0x65, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x22, 0x42, 0x0a,
	0x04, 0x44, 0x61, 0x74, 0x65, 0x12, 0x12, 0x0a, 0x04, 0x79, 0x65, 0x61, 0x72, 0x18, 0x01, 0x20,
	0x01, 0x28, 0x05, 0x52, 0x04, 0x79, 0x65, 0x61, 0x72, 0x12, 0x14, 0x0a, 0x05, 0x6d, 0x6f, 0x6e,
	0x74, 0x68, 0x18, 0x02, 0x20, 0x01, 0x28, 0x05, 0x52, 0x05, 0x6d, 0x6f, 0x6e, 0x74, 0x68, 0x12,
	0x10, 0x0a, 0x03, 0x64, 0x61, 0x79, 0x18, 0x03, 0x20, 0x01, 0x28, 0x05, 0x52, 0x03, 0x64, 0x61,
	0x79, 0x22, 0xf3, 0x02, 0x0a, 0x04, 0x49, 0x74, 0x65, 0x6d, 0x12, 0x16, 0x0a, 0x06, 0x69, 0x74,
	0x65, 0x6d, 0x49, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x03, 0x52, 0x06, 0x69, 0x74, 0x65, 0x6d,
	0x49, 0x64, 0x12, 0x1a, 0x0a, 0x08, 0x69, 0x74, 0x65, 0x6d, 0x4e, 0x61, 0x6d, 0x65, 0x18, 0x02,
	0x20, 0x01, 0x28, 0x09, 0x52, 0x08, 0x69, 0x74, 0x65, 0x6d, 0x4e, 0x61, 0x6d, 0x65, 0x12, 0x2e,
	0x0a, 0x04, 0x74, 0x79, 0x70, 0x65, 0x18, 0x03, 0x20, 0x01, 0x28, 0x0e, 0x32, 0x1a, 0x2e, 0x73,
	0x68, 0x6f, 0x70, 0x70, 0x69, 0x6e, 0x67, 0x5f, 0x6c, 0x69, 0x73, 0x74, 0x2e, 0x50, 0x72, 0x6f,
	0x64, 0x75, 0x63, 0x74, 0x54, 0x79, 0x70, 0x65, 0x52, 0x04, 0x74, 0x79, 0x70, 0x65, 0x12, 0x27,
	0x0a, 0x04, 0x75, 0x6e, 0x69, 0x74, 0x18, 0x04, 0x20, 0x01, 0x28, 0x0e, 0x32, 0x13, 0x2e, 0x73,
	0x68, 0x6f, 0x70, 0x70, 0x69, 0x6e, 0x67, 0x5f, 0x6c, 0x69, 0x73, 0x74, 0x2e, 0x55, 0x6e, 0x69,
	0x74, 0x52, 0x04, 0x75, 0x6e, 0x69, 0x74, 0x12, 0x1a, 0x0a, 0x08, 0x71, 0x75, 0x61, 0x6e, 0x74,
	0x69, 0x74, 0x79, 0x18, 0x05, 0x20, 0x01, 0x28, 0x05, 0x52, 0x08, 0x71, 0x75, 0x61, 0x6e, 0x74,
	0x69, 0x74, 0x79, 0x12, 0x38, 0x0a, 0x0a, 0x65, 0x78, 0x70, 0x69, 0x72, 0x61, 0x74, 0x69, 0x6f,
	0x6e, 0x18, 0x06, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x18, 0x2e, 0x73, 0x68, 0x6f, 0x70, 0x70, 0x69,
	0x6e, 0x67, 0x5f, 0x6c, 0x69, 0x73, 0x74, 0x2e, 0x54, 0x69, 0x6d, 0x65, 0x73, 0x74, 0x61, 0x6d,
	0x70, 0x52, 0x0a, 0x65, 0x78, 0x70, 0x69, 0x72, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x12, 0x1a, 0x0a,
	0x08, 0x6c, 0x61, 0x73, 0x74, 0x55, 0x73, 0x65, 0x64, 0x18, 0x07, 0x20, 0x01, 0x28, 0x03, 0x52,
	0x08, 0x6c, 0x61, 0x73, 0x74, 0x55, 0x73, 0x65, 0x64, 0x12, 0x1c, 0x0a, 0x09, 0x75, 0x73, 0x65,
	0x4e, 0x75, 0x6d, 0x62, 0x65, 0x72, 0x18, 0x08, 0x20, 0x01, 0x28, 0x05, 0x52, 0x09, 0x75, 0x73,
	0x65, 0x4e, 0x75, 0x6d, 0x62, 0x65, 0x72, 0x12, 0x28, 0x0a, 0x0f, 0x74, 0x6f, 0x74, 0x61, 0x6c,
	0x55, 0x73, 0x65, 0x64, 0x4e, 0x75, 0x6d, 0x62, 0x65, 0x72, 0x18, 0x09, 0x20, 0x01, 0x28, 0x05,
	0x52, 0x0f, 0x74, 0x6f, 0x74, 0x61, 0x6c, 0x55, 0x73, 0x65, 0x64, 0x4e, 0x75, 0x6d, 0x62, 0x65,
	0x72, 0x12, 0x24, 0x0a, 0x0d, 0x74, 0x69, 0x6d, 0x65, 0x73, 0x49, 0x73, 0x42, 0x6f, 0x75, 0x67,
	0x68, 0x74, 0x18, 0x0a, 0x20, 0x01, 0x28, 0x05, 0x52, 0x0d, 0x74, 0x69, 0x6d, 0x65, 0x73, 0x49,
	0x73, 0x42, 0x6f, 0x75, 0x67, 0x68, 0x74, 0x22, 0x3b, 0x0a, 0x06, 0x50, 0x61, 0x6e, 0x74, 0x72,
	0x79, 0x12, 0x31, 0x0a, 0x08, 0x70, 0x72, 0x6f, 0x64, 0x75, 0x63, 0x74, 0x73, 0x18, 0x01, 0x20,
	0x03, 0x28, 0x0b, 0x32, 0x15, 0x2e, 0x70, 0x72, 0x6f, 0x64, 0x75, 0x63, 0x74, 0x5f, 0x73, 0x74,
	0x6f, 0x72, 0x61, 0x67, 0x65, 0x2e, 0x49, 0x74, 0x65, 0x6d, 0x52, 0x08, 0x70, 0x72, 0x6f, 0x64,
	0x75, 0x63, 0x74, 0x73, 0x22, 0x9b, 0x01, 0x0a, 0x08, 0x55, 0x73, 0x65, 0x64, 0x49, 0x74, 0x65,
	0x6d, 0x12, 0x12, 0x0a, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52,
	0x04, 0x6e, 0x61, 0x6d, 0x65, 0x12, 0x1a, 0x0a, 0x08, 0x71, 0x75, 0x61, 0x6e, 0x74, 0x69, 0x74,
	0x79, 0x18, 0x02, 0x20, 0x01, 0x28, 0x05, 0x52, 0x08, 0x71, 0x75, 0x61, 0x6e, 0x74, 0x69, 0x74,
	0x79, 0x12, 0x27, 0x0a, 0x04, 0x75, 0x6e, 0x69, 0x74, 0x18, 0x03, 0x20, 0x01, 0x28, 0x0e, 0x32,
	0x13, 0x2e, 0x73, 0x68, 0x6f, 0x70, 0x70, 0x69, 0x6e, 0x67, 0x5f, 0x6c, 0x69, 0x73, 0x74, 0x2e,
	0x55, 0x6e, 0x69, 0x74, 0x52, 0x04, 0x75, 0x6e, 0x69, 0x74, 0x12, 0x36, 0x0a, 0x08, 0x69, 0x74,
	0x65, 0x6d, 0x54, 0x79, 0x70, 0x65, 0x18, 0x04, 0x20, 0x01, 0x28, 0x0e, 0x32, 0x1a, 0x2e, 0x73,
	0x68, 0x6f, 0x70, 0x70, 0x69, 0x6e, 0x67, 0x5f, 0x6c, 0x69, 0x73, 0x74, 0x2e, 0x50, 0x72, 0x6f,
	0x64, 0x75, 0x63, 0x74, 0x54, 0x79, 0x70, 0x65, 0x52, 0x08, 0x69, 0x74, 0x65, 0x6d, 0x54, 0x79,
	0x70, 0x65, 0x22, 0x0f, 0x0a, 0x0d, 0x50, 0x61, 0x6e, 0x74, 0x72, 0x79, 0x4d, 0x65, 0x73, 0x73,
	0x61, 0x67, 0x65, 0x32, 0xce, 0x03, 0x0a, 0x0e, 0x50, 0x72, 0x6f, 0x64, 0x75, 0x63, 0x74, 0x53,
	0x74, 0x6f, 0x72, 0x61, 0x67, 0x65, 0x12, 0x50, 0x0a, 0x19, 0x41, 0x64, 0x64, 0x42, 0x6f, 0x75,
	0x67, 0x68, 0x74, 0x50, 0x72, 0x6f, 0x64, 0x75, 0x63, 0x74, 0x73, 0x54, 0x6f, 0x50, 0x61, 0x6e,
	0x74, 0x72, 0x79, 0x12, 0x1a, 0x2e, 0x73, 0x68, 0x6f, 0x70, 0x70, 0x69, 0x6e, 0x67, 0x5f, 0x6c,
	0x69, 0x73, 0x74, 0x2e, 0x50, 0x72, 0x6f, 0x64, 0x75, 0x63, 0x74, 0x4c, 0x69, 0x73, 0x74, 0x1a,
	0x17, 0x2e, 0x73, 0x68, 0x6f, 0x70, 0x70, 0x69, 0x6e, 0x67, 0x5f, 0x6c, 0x69, 0x73, 0x74, 0x2e,
	0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x44, 0x0a, 0x12, 0x41, 0x64, 0x64, 0x50,
	0x72, 0x6f, 0x64, 0x75, 0x63, 0x74, 0x54, 0x6f, 0x50, 0x61, 0x6e, 0x74, 0x72, 0x79, 0x12, 0x15,
	0x2e, 0x70, 0x72, 0x6f, 0x64, 0x75, 0x63, 0x74, 0x5f, 0x73, 0x74, 0x6f, 0x72, 0x61, 0x67, 0x65,
	0x2e, 0x49, 0x74, 0x65, 0x6d, 0x1a, 0x17, 0x2e, 0x73, 0x68, 0x6f, 0x70, 0x70, 0x69, 0x6e, 0x67,
	0x5f, 0x6c, 0x69, 0x73, 0x74, 0x2e, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x4b,
	0x0a, 0x15, 0x44, 0x72, 0x6f, 0x70, 0x50, 0x72, 0x6f, 0x64, 0x75, 0x63, 0x74, 0x46, 0x72, 0x6f,
	0x6d, 0x50, 0x61, 0x6e, 0x74, 0x72, 0x79, 0x12, 0x19, 0x2e, 0x70, 0x72, 0x6f, 0x64, 0x75, 0x63,
	0x74, 0x5f, 0x73, 0x74, 0x6f, 0x72, 0x61, 0x67, 0x65, 0x2e, 0x49, 0x74, 0x65, 0x6d, 0x4e, 0x61,
	0x6d, 0x65, 0x1a, 0x17, 0x2e, 0x73, 0x68, 0x6f, 0x70, 0x70, 0x69, 0x6e, 0x67, 0x5f, 0x6c, 0x69,
	0x73, 0x74, 0x2e, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x47, 0x0a, 0x15, 0x55,
	0x70, 0x64, 0x61, 0x74, 0x65, 0x50, 0x72, 0x6f, 0x64, 0x75, 0x63, 0x74, 0x49, 0x6e, 0x50, 0x61,
	0x6e, 0x74, 0x72, 0x79, 0x12, 0x15, 0x2e, 0x70, 0x72, 0x6f, 0x64, 0x75, 0x63, 0x74, 0x5f, 0x73,
	0x74, 0x6f, 0x72, 0x61, 0x67, 0x65, 0x2e, 0x49, 0x74, 0x65, 0x6d, 0x1a, 0x17, 0x2e, 0x73, 0x68,
	0x6f, 0x70, 0x70, 0x69, 0x6e, 0x67, 0x5f, 0x6c, 0x69, 0x73, 0x74, 0x2e, 0x52, 0x65, 0x73, 0x70,
	0x6f, 0x6e, 0x73, 0x65, 0x12, 0x48, 0x0a, 0x12, 0x55, 0x73, 0x65, 0x50, 0x72, 0x6f, 0x64, 0x75,
	0x63, 0x74, 0x49, 0x6e, 0x50, 0x61, 0x6e, 0x74, 0x72, 0x79, 0x12, 0x19, 0x2e, 0x70, 0x72, 0x6f,
	0x64, 0x75, 0x63, 0x74, 0x5f, 0x73, 0x74, 0x6f, 0x72, 0x61, 0x67, 0x65, 0x2e, 0x55, 0x73, 0x65,
	0x64, 0x49, 0x74, 0x65, 0x6d, 0x1a, 0x17, 0x2e, 0x73, 0x68, 0x6f, 0x70, 0x70, 0x69, 0x6e, 0x67,
	0x5f, 0x6c, 0x69, 0x73, 0x74, 0x2e, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x44,
	0x0a, 0x09, 0x47, 0x65, 0x74, 0x50, 0x61, 0x6e, 0x74, 0x72, 0x79, 0x12, 0x1e, 0x2e, 0x70, 0x72,
	0x6f, 0x64, 0x75, 0x63, 0x74, 0x5f, 0x73, 0x74, 0x6f, 0x72, 0x61, 0x67, 0x65, 0x2e, 0x50, 0x61,
	0x6e, 0x74, 0x72, 0x79, 0x4d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x1a, 0x17, 0x2e, 0x70, 0x72,
	0x6f, 0x64, 0x75, 0x63, 0x74, 0x5f, 0x73, 0x74, 0x6f, 0x72, 0x61, 0x67, 0x65, 0x2e, 0x50, 0x61,
	0x6e, 0x74, 0x72, 0x79, 0x42, 0x13, 0x5a, 0x11, 0x2e, 0x3b, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x5f,
	0x67, 0x65, 0x6e, 0x65, 0x72, 0x61, 0x74, 0x65, 0x64, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f,
	0x33,
}

var (
	file_product_storage_proto_rawDescOnce sync.Once
	file_product_storage_proto_rawDescData = file_product_storage_proto_rawDesc
)

func file_product_storage_proto_rawDescGZIP() []byte {
	file_product_storage_proto_rawDescOnce.Do(func() {
		file_product_storage_proto_rawDescData = protoimpl.X.CompressGZIP(file_product_storage_proto_rawDescData)
	})
	return file_product_storage_proto_rawDescData
}

var file_product_storage_proto_msgTypes = make([]protoimpl.MessageInfo, 6)
var file_product_storage_proto_goTypes = []interface{}{
	(*ItemName)(nil),      // 0: product_storage.ItemName
	(*Date)(nil),          // 1: product_storage.Date
	(*Item)(nil),          // 2: product_storage.Item
	(*Pantry)(nil),        // 3: product_storage.Pantry
	(*UsedItem)(nil),      // 4: product_storage.UsedItem
	(*PantryMessage)(nil), // 5: product_storage.PantryMessage
	(ProductType)(0),      // 6: shopping_list.ProductType
	(Unit)(0),             // 7: shopping_list.Unit
	(*Timestamp)(nil),     // 8: shopping_list.Timestamp
	(*ProductList)(nil),   // 9: shopping_list.ProductList
	(*Response)(nil),      // 10: shopping_list.Response
}
var file_product_storage_proto_depIdxs = []int32{
	6,  // 0: product_storage.Item.type:type_name -> shopping_list.ProductType
	7,  // 1: product_storage.Item.unit:type_name -> shopping_list.Unit
	8,  // 2: product_storage.Item.expiration:type_name -> shopping_list.Timestamp
	2,  // 3: product_storage.Pantry.products:type_name -> product_storage.Item
	7,  // 4: product_storage.UsedItem.unit:type_name -> shopping_list.Unit
	6,  // 5: product_storage.UsedItem.itemType:type_name -> shopping_list.ProductType
	9,  // 6: product_storage.ProductStorage.AddBoughtProductsToPantry:input_type -> shopping_list.ProductList
	2,  // 7: product_storage.ProductStorage.AddProductToPantry:input_type -> product_storage.Item
	0,  // 8: product_storage.ProductStorage.DropProductFromPantry:input_type -> product_storage.ItemName
	2,  // 9: product_storage.ProductStorage.UpdateProductInPantry:input_type -> product_storage.Item
	4,  // 10: product_storage.ProductStorage.UseProductInPantry:input_type -> product_storage.UsedItem
	5,  // 11: product_storage.ProductStorage.GetPantry:input_type -> product_storage.PantryMessage
	10, // 12: product_storage.ProductStorage.AddBoughtProductsToPantry:output_type -> shopping_list.Response
	10, // 13: product_storage.ProductStorage.AddProductToPantry:output_type -> shopping_list.Response
	10, // 14: product_storage.ProductStorage.DropProductFromPantry:output_type -> shopping_list.Response
	10, // 15: product_storage.ProductStorage.UpdateProductInPantry:output_type -> shopping_list.Response
	10, // 16: product_storage.ProductStorage.UseProductInPantry:output_type -> shopping_list.Response
	3,  // 17: product_storage.ProductStorage.GetPantry:output_type -> product_storage.Pantry
	12, // [12:18] is the sub-list for method output_type
	6,  // [6:12] is the sub-list for method input_type
	6,  // [6:6] is the sub-list for extension type_name
	6,  // [6:6] is the sub-list for extension extendee
	0,  // [0:6] is the sub-list for field type_name
}

func init() { file_product_storage_proto_init() }
func file_product_storage_proto_init() {
	if File_product_storage_proto != nil {
		return
	}
	file_shopping_list_proto_init()
	if !protoimpl.UnsafeEnabled {
		file_product_storage_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ItemName); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_product_storage_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Date); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_product_storage_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Item); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_product_storage_proto_msgTypes[3].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Pantry); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_product_storage_proto_msgTypes[4].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*UsedItem); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_product_storage_proto_msgTypes[5].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*PantryMessage); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_product_storage_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   6,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_product_storage_proto_goTypes,
		DependencyIndexes: file_product_storage_proto_depIdxs,
		MessageInfos:      file_product_storage_proto_msgTypes,
	}.Build()
	File_product_storage_proto = out.File
	file_product_storage_proto_rawDesc = nil
	file_product_storage_proto_goTypes = nil
	file_product_storage_proto_depIdxs = nil
}
