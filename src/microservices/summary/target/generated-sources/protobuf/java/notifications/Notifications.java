// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: notifications.proto

package notifications;

public final class Notifications {
  private Notifications() {}
  public static void registerAllExtensions(
      com.google.protobuf.ExtensionRegistryLite registry) {
  }

  public static void registerAllExtensions(
      com.google.protobuf.ExtensionRegistry registry) {
    registerAllExtensions(
        (com.google.protobuf.ExtensionRegistryLite) registry);
  }

  public static com.google.protobuf.Descriptors.FileDescriptor
      getDescriptor() {
    return descriptor;
  }
  private static  com.google.protobuf.Descriptors.FileDescriptor
      descriptor;
  static {
    java.lang.String[] descriptorData = {
      "\n\023notifications.proto\022\rnotifications\032\023sh" +
      "opping_list.proto2\222\001\n\014Notification\022A\n\016No" +
      "tifyDeadline\022\026.shopping_list.Product\032\027.s" +
      "hopping_list.Response\022?\n\014NotifyRunOut\022\026." +
      "shopping_list.Product\032\027.shopping_list.Re" +
      "sponseB\023Z\021.;proto_generatedb\006proto3"
    };
    descriptor = com.google.protobuf.Descriptors.FileDescriptor
      .internalBuildGeneratedFileFrom(descriptorData,
        new com.google.protobuf.Descriptors.FileDescriptor[] {
          shopping_list.ShoppingListOuterClass.getDescriptor(),
        });
    shopping_list.ShoppingListOuterClass.getDescriptor();
  }

  // @@protoc_insertion_point(outer_class_scope)
}