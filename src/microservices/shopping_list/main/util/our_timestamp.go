package util

import (
	"google.golang.org/protobuf/types/known/timestamppb"
	protos "shoppinglist.microservice/generated"
)

// ToOurTimestamp converts google timestamp in to our proto Timestamp (done to avoid problems in Rust)
func ToOurTimestamp(theirTimestamp *timestamppb.Timestamp) *protos.Timestamp {
	return &protos.Timestamp{
		Seconds: theirTimestamp.Seconds,
		Nanos:   theirTimestamp.Nanos,
	}
}
