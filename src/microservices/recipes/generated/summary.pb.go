// version of protocol buffer used

// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.28.1
// 	protoc        v3.15.8
// source: summary.proto

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

type Period int32

const (
	Period_Weekly  Period = 0
	Period_Monthly Period = 1
	Period_Total   Period = 2
)

// Enum value maps for Period.
var (
	Period_name = map[int32]string{
		0: "Weekly",
		1: "Monthly",
		2: "Total",
	}
	Period_value = map[string]int32{
		"Weekly":  0,
		"Monthly": 1,
		"Total":   2,
	}
)

func (x Period) Enum() *Period {
	p := new(Period)
	*p = x
	return p
}

func (x Period) String() string {
	return protoimpl.X.EnumStringOf(x.Descriptor(), protoreflect.EnumNumber(x))
}

func (Period) Descriptor() protoreflect.EnumDescriptor {
	return file_summary_proto_enumTypes[0].Descriptor()
}

func (Period) Type() protoreflect.EnumType {
	return &file_summary_proto_enumTypes[0]
}

func (x Period) Number() protoreflect.EnumNumber {
	return protoreflect.EnumNumber(x)
}

// Deprecated: Use Period.Descriptor instead.
func (Period) EnumDescriptor() ([]byte, []int) {
	return file_summary_proto_rawDescGZIP(), []int{0}
}

type SummaryRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields
}

func (x *SummaryRequest) Reset() {
	*x = SummaryRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_summary_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *SummaryRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*SummaryRequest) ProtoMessage() {}

func (x *SummaryRequest) ProtoReflect() protoreflect.Message {
	mi := &file_summary_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use SummaryRequest.ProtoReflect.Descriptor instead.
func (*SummaryRequest) Descriptor() ([]byte, []int) {
	return file_summary_proto_rawDescGZIP(), []int{0}
}

type SummaryData struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Reference         Period `protobuf:"varint,1,opt,name=reference,proto3,enum=summary.Period" json:"reference,omitempty"`
	MostUsedProduct   string `protobuf:"bytes,2,opt,name=mostUsedProduct,proto3" json:"mostUsedProduct,omitempty"`
	MostBoughtProduct string `protobuf:"bytes,3,opt,name=mostBoughtProduct,proto3" json:"mostBoughtProduct,omitempty"`
	TimesUsed         int32  `protobuf:"varint,4,opt,name=timesUsed,proto3" json:"timesUsed,omitempty"`
	TimesBought       int32  `protobuf:"varint,5,opt,name=timesBought,proto3" json:"timesBought,omitempty"`     // Quante volte ?? stato comprato in settimana/mese
	NumberExpired     int32  `protobuf:"varint,6,opt,name=numberExpired,proto3" json:"numberExpired,omitempty"` // Quanti sono scaduti
}

func (x *SummaryData) Reset() {
	*x = SummaryData{}
	if protoimpl.UnsafeEnabled {
		mi := &file_summary_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *SummaryData) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*SummaryData) ProtoMessage() {}

func (x *SummaryData) ProtoReflect() protoreflect.Message {
	mi := &file_summary_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use SummaryData.ProtoReflect.Descriptor instead.
func (*SummaryData) Descriptor() ([]byte, []int) {
	return file_summary_proto_rawDescGZIP(), []int{1}
}

func (x *SummaryData) GetReference() Period {
	if x != nil {
		return x.Reference
	}
	return Period_Weekly
}

func (x *SummaryData) GetMostUsedProduct() string {
	if x != nil {
		return x.MostUsedProduct
	}
	return ""
}

func (x *SummaryData) GetMostBoughtProduct() string {
	if x != nil {
		return x.MostBoughtProduct
	}
	return ""
}

func (x *SummaryData) GetTimesUsed() int32 {
	if x != nil {
		return x.TimesUsed
	}
	return 0
}

func (x *SummaryData) GetTimesBought() int32 {
	if x != nil {
		return x.TimesBought
	}
	return 0
}

func (x *SummaryData) GetNumberExpired() int32 {
	if x != nil {
		return x.NumberExpired
	}
	return 0
}

var File_summary_proto protoreflect.FileDescriptor

var file_summary_proto_rawDesc = []byte{
	0x0a, 0x0d, 0x73, 0x75, 0x6d, 0x6d, 0x61, 0x72, 0x79, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12,
	0x07, 0x73, 0x75, 0x6d, 0x6d, 0x61, 0x72, 0x79, 0x22, 0x10, 0x0a, 0x0e, 0x53, 0x75, 0x6d, 0x6d,
	0x61, 0x72, 0x79, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x22, 0xfa, 0x01, 0x0a, 0x0b, 0x53,
	0x75, 0x6d, 0x6d, 0x61, 0x72, 0x79, 0x44, 0x61, 0x74, 0x61, 0x12, 0x2d, 0x0a, 0x09, 0x72, 0x65,
	0x66, 0x65, 0x72, 0x65, 0x6e, 0x63, 0x65, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0e, 0x32, 0x0f, 0x2e,
	0x73, 0x75, 0x6d, 0x6d, 0x61, 0x72, 0x79, 0x2e, 0x50, 0x65, 0x72, 0x69, 0x6f, 0x64, 0x52, 0x09,
	0x72, 0x65, 0x66, 0x65, 0x72, 0x65, 0x6e, 0x63, 0x65, 0x12, 0x28, 0x0a, 0x0f, 0x6d, 0x6f, 0x73,
	0x74, 0x55, 0x73, 0x65, 0x64, 0x50, 0x72, 0x6f, 0x64, 0x75, 0x63, 0x74, 0x18, 0x02, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x0f, 0x6d, 0x6f, 0x73, 0x74, 0x55, 0x73, 0x65, 0x64, 0x50, 0x72, 0x6f, 0x64,
	0x75, 0x63, 0x74, 0x12, 0x2c, 0x0a, 0x11, 0x6d, 0x6f, 0x73, 0x74, 0x42, 0x6f, 0x75, 0x67, 0x68,
	0x74, 0x50, 0x72, 0x6f, 0x64, 0x75, 0x63, 0x74, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09, 0x52, 0x11,
	0x6d, 0x6f, 0x73, 0x74, 0x42, 0x6f, 0x75, 0x67, 0x68, 0x74, 0x50, 0x72, 0x6f, 0x64, 0x75, 0x63,
	0x74, 0x12, 0x1c, 0x0a, 0x09, 0x74, 0x69, 0x6d, 0x65, 0x73, 0x55, 0x73, 0x65, 0x64, 0x18, 0x04,
	0x20, 0x01, 0x28, 0x05, 0x52, 0x09, 0x74, 0x69, 0x6d, 0x65, 0x73, 0x55, 0x73, 0x65, 0x64, 0x12,
	0x20, 0x0a, 0x0b, 0x74, 0x69, 0x6d, 0x65, 0x73, 0x42, 0x6f, 0x75, 0x67, 0x68, 0x74, 0x18, 0x05,
	0x20, 0x01, 0x28, 0x05, 0x52, 0x0b, 0x74, 0x69, 0x6d, 0x65, 0x73, 0x42, 0x6f, 0x75, 0x67, 0x68,
	0x74, 0x12, 0x24, 0x0a, 0x0d, 0x6e, 0x75, 0x6d, 0x62, 0x65, 0x72, 0x45, 0x78, 0x70, 0x69, 0x72,
	0x65, 0x64, 0x18, 0x06, 0x20, 0x01, 0x28, 0x05, 0x52, 0x0d, 0x6e, 0x75, 0x6d, 0x62, 0x65, 0x72,
	0x45, 0x78, 0x70, 0x69, 0x72, 0x65, 0x64, 0x2a, 0x2c, 0x0a, 0x06, 0x50, 0x65, 0x72, 0x69, 0x6f,
	0x64, 0x12, 0x0a, 0x0a, 0x06, 0x57, 0x65, 0x65, 0x6b, 0x6c, 0x79, 0x10, 0x00, 0x12, 0x0b, 0x0a,
	0x07, 0x4d, 0x6f, 0x6e, 0x74, 0x68, 0x6c, 0x79, 0x10, 0x01, 0x12, 0x09, 0x0a, 0x05, 0x54, 0x6f,
	0x74, 0x61, 0x6c, 0x10, 0x02, 0x32, 0xc5, 0x01, 0x0a, 0x07, 0x53, 0x75, 0x6d, 0x6d, 0x61, 0x72,
	0x79, 0x12, 0x3c, 0x0a, 0x0b, 0x57, 0x65, 0x65, 0x6b, 0x53, 0x75, 0x6d, 0x6d, 0x61, 0x72, 0x79,
	0x12, 0x17, 0x2e, 0x73, 0x75, 0x6d, 0x6d, 0x61, 0x72, 0x79, 0x2e, 0x53, 0x75, 0x6d, 0x6d, 0x61,
	0x72, 0x79, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x14, 0x2e, 0x73, 0x75, 0x6d, 0x6d,
	0x61, 0x72, 0x79, 0x2e, 0x53, 0x75, 0x6d, 0x6d, 0x61, 0x72, 0x79, 0x44, 0x61, 0x74, 0x61, 0x12,
	0x3d, 0x0a, 0x0c, 0x4d, 0x6f, 0x6e, 0x74, 0x68, 0x53, 0x75, 0x6d, 0x6d, 0x61, 0x72, 0x79, 0x12,
	0x17, 0x2e, 0x73, 0x75, 0x6d, 0x6d, 0x61, 0x72, 0x79, 0x2e, 0x53, 0x75, 0x6d, 0x6d, 0x61, 0x72,
	0x79, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x14, 0x2e, 0x73, 0x75, 0x6d, 0x6d, 0x61,
	0x72, 0x79, 0x2e, 0x53, 0x75, 0x6d, 0x6d, 0x61, 0x72, 0x79, 0x44, 0x61, 0x74, 0x61, 0x12, 0x3d,
	0x0a, 0x0c, 0x54, 0x6f, 0x74, 0x61, 0x6c, 0x53, 0x75, 0x6d, 0x6d, 0x61, 0x72, 0x79, 0x12, 0x17,
	0x2e, 0x73, 0x75, 0x6d, 0x6d, 0x61, 0x72, 0x79, 0x2e, 0x53, 0x75, 0x6d, 0x6d, 0x61, 0x72, 0x79,
	0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x14, 0x2e, 0x73, 0x75, 0x6d, 0x6d, 0x61, 0x72,
	0x79, 0x2e, 0x53, 0x75, 0x6d, 0x6d, 0x61, 0x72, 0x79, 0x44, 0x61, 0x74, 0x61, 0x42, 0x48, 0x0a,
	0x1d, 0x63, 0x6f, 0x6d, 0x2e, 0x73, 0x64, 0x63, 0x63, 0x2e, 0x73, 0x68, 0x6f, 0x70, 0x70, 0x69,
	0x6e, 0x67, 0x6c, 0x69, 0x73, 0x74, 0x2e, 0x73, 0x75, 0x6d, 0x6d, 0x61, 0x72, 0x79, 0x42, 0x0c,
	0x53, 0x75, 0x6d, 0x6d, 0x61, 0x72, 0x79, 0x50, 0x72, 0x6f, 0x74, 0x6f, 0x50, 0x01, 0x5a, 0x11,
	0x2e, 0x3b, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x5f, 0x67, 0x65, 0x6e, 0x65, 0x72, 0x61, 0x74, 0x65,
	0x64, 0xa2, 0x02, 0x03, 0x53, 0x55, 0x4d, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_summary_proto_rawDescOnce sync.Once
	file_summary_proto_rawDescData = file_summary_proto_rawDesc
)

func file_summary_proto_rawDescGZIP() []byte {
	file_summary_proto_rawDescOnce.Do(func() {
		file_summary_proto_rawDescData = protoimpl.X.CompressGZIP(file_summary_proto_rawDescData)
	})
	return file_summary_proto_rawDescData
}

var file_summary_proto_enumTypes = make([]protoimpl.EnumInfo, 1)
var file_summary_proto_msgTypes = make([]protoimpl.MessageInfo, 2)
var file_summary_proto_goTypes = []interface{}{
	(Period)(0),            // 0: summary.Period
	(*SummaryRequest)(nil), // 1: summary.SummaryRequest
	(*SummaryData)(nil),    // 2: summary.SummaryData
}
var file_summary_proto_depIdxs = []int32{
	0, // 0: summary.SummaryData.reference:type_name -> summary.Period
	1, // 1: summary.Summary.WeekSummary:input_type -> summary.SummaryRequest
	1, // 2: summary.Summary.MonthSummary:input_type -> summary.SummaryRequest
	1, // 3: summary.Summary.TotalSummary:input_type -> summary.SummaryRequest
	2, // 4: summary.Summary.WeekSummary:output_type -> summary.SummaryData
	2, // 5: summary.Summary.MonthSummary:output_type -> summary.SummaryData
	2, // 6: summary.Summary.TotalSummary:output_type -> summary.SummaryData
	4, // [4:7] is the sub-list for method output_type
	1, // [1:4] is the sub-list for method input_type
	1, // [1:1] is the sub-list for extension type_name
	1, // [1:1] is the sub-list for extension extendee
	0, // [0:1] is the sub-list for field type_name
}

func init() { file_summary_proto_init() }
func file_summary_proto_init() {
	if File_summary_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_summary_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*SummaryRequest); i {
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
		file_summary_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*SummaryData); i {
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
			RawDescriptor: file_summary_proto_rawDesc,
			NumEnums:      1,
			NumMessages:   2,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_summary_proto_goTypes,
		DependencyIndexes: file_summary_proto_depIdxs,
		EnumInfos:         file_summary_proto_enumTypes,
		MessageInfos:      file_summary_proto_msgTypes,
	}.Build()
	File_summary_proto = out.File
	file_summary_proto_rawDesc = nil
	file_summary_proto_goTypes = nil
	file_summary_proto_depIdxs = nil
}
