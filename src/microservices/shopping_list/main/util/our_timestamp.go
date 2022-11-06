package util

import (
	"google.golang.org/protobuf/types/known/timestamppb"
	protos "shoppinglist.microservice/generated"
)

func ToOurTimestamp(theirTimestamp *timestamppb.Timestamp) *protos.Timestamp {
	return &protos.Timestamp{
		Seconds: theirTimestamp.Seconds,
		Nanos:   theirTimestamp.Nanos,
	}
}
