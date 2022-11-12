package notifications;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 * <pre>
 * service which can be executed
 * </pre>
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler (version 1.50.2)",
    comments = "Source: notifications.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class NotificationGrpc {

  private NotificationGrpc() {}

  public static final String SERVICE_NAME = "notifications.Notification";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<shopping_list.ShoppingListOuterClass.Product,
      shopping_list.ShoppingListOuterClass.Response> getNotifyDeadlineMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "NotifyDeadline",
      requestType = shopping_list.ShoppingListOuterClass.Product.class,
      responseType = shopping_list.ShoppingListOuterClass.Response.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<shopping_list.ShoppingListOuterClass.Product,
      shopping_list.ShoppingListOuterClass.Response> getNotifyDeadlineMethod() {
    io.grpc.MethodDescriptor<shopping_list.ShoppingListOuterClass.Product, shopping_list.ShoppingListOuterClass.Response> getNotifyDeadlineMethod;
    if ((getNotifyDeadlineMethod = NotificationGrpc.getNotifyDeadlineMethod) == null) {
      synchronized (NotificationGrpc.class) {
        if ((getNotifyDeadlineMethod = NotificationGrpc.getNotifyDeadlineMethod) == null) {
          NotificationGrpc.getNotifyDeadlineMethod = getNotifyDeadlineMethod =
              io.grpc.MethodDescriptor.<shopping_list.ShoppingListOuterClass.Product, shopping_list.ShoppingListOuterClass.Response>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "NotifyDeadline"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  shopping_list.ShoppingListOuterClass.Product.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  shopping_list.ShoppingListOuterClass.Response.getDefaultInstance()))
              .setSchemaDescriptor(new NotificationMethodDescriptorSupplier("NotifyDeadline"))
              .build();
        }
      }
    }
    return getNotifyDeadlineMethod;
  }

  private static volatile io.grpc.MethodDescriptor<shopping_list.ShoppingListOuterClass.Product,
      shopping_list.ShoppingListOuterClass.Response> getNotifyRunOutMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "NotifyRunOut",
      requestType = shopping_list.ShoppingListOuterClass.Product.class,
      responseType = shopping_list.ShoppingListOuterClass.Response.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<shopping_list.ShoppingListOuterClass.Product,
      shopping_list.ShoppingListOuterClass.Response> getNotifyRunOutMethod() {
    io.grpc.MethodDescriptor<shopping_list.ShoppingListOuterClass.Product, shopping_list.ShoppingListOuterClass.Response> getNotifyRunOutMethod;
    if ((getNotifyRunOutMethod = NotificationGrpc.getNotifyRunOutMethod) == null) {
      synchronized (NotificationGrpc.class) {
        if ((getNotifyRunOutMethod = NotificationGrpc.getNotifyRunOutMethod) == null) {
          NotificationGrpc.getNotifyRunOutMethod = getNotifyRunOutMethod =
              io.grpc.MethodDescriptor.<shopping_list.ShoppingListOuterClass.Product, shopping_list.ShoppingListOuterClass.Response>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "NotifyRunOut"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  shopping_list.ShoppingListOuterClass.Product.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  shopping_list.ShoppingListOuterClass.Response.getDefaultInstance()))
              .setSchemaDescriptor(new NotificationMethodDescriptorSupplier("NotifyRunOut"))
              .build();
        }
      }
    }
    return getNotifyRunOutMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static NotificationStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<NotificationStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<NotificationStub>() {
        @java.lang.Override
        public NotificationStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new NotificationStub(channel, callOptions);
        }
      };
    return NotificationStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static NotificationBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<NotificationBlockingStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<NotificationBlockingStub>() {
        @java.lang.Override
        public NotificationBlockingStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new NotificationBlockingStub(channel, callOptions);
        }
      };
    return NotificationBlockingStub.newStub(factory, channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static NotificationFutureStub newFutureStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<NotificationFutureStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<NotificationFutureStub>() {
        @java.lang.Override
        public NotificationFutureStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new NotificationFutureStub(channel, callOptions);
        }
      };
    return NotificationFutureStub.newStub(factory, channel);
  }

  /**
   * <pre>
   * service which can be executed
   * </pre>
   */
  public static abstract class NotificationImplBase implements io.grpc.BindableService {

    /**
     */
    public void notifyDeadline(shopping_list.ShoppingListOuterClass.Product request,
        io.grpc.stub.StreamObserver<shopping_list.ShoppingListOuterClass.Response> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getNotifyDeadlineMethod(), responseObserver);
    }

    /**
     */
    public void notifyRunOut(shopping_list.ShoppingListOuterClass.Product request,
        io.grpc.stub.StreamObserver<shopping_list.ShoppingListOuterClass.Response> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getNotifyRunOutMethod(), responseObserver);
    }

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
          .addMethod(
            getNotifyDeadlineMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                shopping_list.ShoppingListOuterClass.Product,
                shopping_list.ShoppingListOuterClass.Response>(
                  this, METHODID_NOTIFY_DEADLINE)))
          .addMethod(
            getNotifyRunOutMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                shopping_list.ShoppingListOuterClass.Product,
                shopping_list.ShoppingListOuterClass.Response>(
                  this, METHODID_NOTIFY_RUN_OUT)))
          .build();
    }
  }

  /**
   * <pre>
   * service which can be executed
   * </pre>
   */
  public static final class NotificationStub extends io.grpc.stub.AbstractAsyncStub<NotificationStub> {
    private NotificationStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected NotificationStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new NotificationStub(channel, callOptions);
    }

    /**
     */
    public void notifyDeadline(shopping_list.ShoppingListOuterClass.Product request,
        io.grpc.stub.StreamObserver<shopping_list.ShoppingListOuterClass.Response> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getNotifyDeadlineMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void notifyRunOut(shopping_list.ShoppingListOuterClass.Product request,
        io.grpc.stub.StreamObserver<shopping_list.ShoppingListOuterClass.Response> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getNotifyRunOutMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   * <pre>
   * service which can be executed
   * </pre>
   */
  public static final class NotificationBlockingStub extends io.grpc.stub.AbstractBlockingStub<NotificationBlockingStub> {
    private NotificationBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected NotificationBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new NotificationBlockingStub(channel, callOptions);
    }

    /**
     */
    public shopping_list.ShoppingListOuterClass.Response notifyDeadline(shopping_list.ShoppingListOuterClass.Product request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getNotifyDeadlineMethod(), getCallOptions(), request);
    }

    /**
     */
    public shopping_list.ShoppingListOuterClass.Response notifyRunOut(shopping_list.ShoppingListOuterClass.Product request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getNotifyRunOutMethod(), getCallOptions(), request);
    }
  }

  /**
   * <pre>
   * service which can be executed
   * </pre>
   */
  public static final class NotificationFutureStub extends io.grpc.stub.AbstractFutureStub<NotificationFutureStub> {
    private NotificationFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected NotificationFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new NotificationFutureStub(channel, callOptions);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<shopping_list.ShoppingListOuterClass.Response> notifyDeadline(
        shopping_list.ShoppingListOuterClass.Product request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getNotifyDeadlineMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<shopping_list.ShoppingListOuterClass.Response> notifyRunOut(
        shopping_list.ShoppingListOuterClass.Product request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getNotifyRunOutMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_NOTIFY_DEADLINE = 0;
  private static final int METHODID_NOTIFY_RUN_OUT = 1;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final NotificationImplBase serviceImpl;
    private final int methodId;

    MethodHandlers(NotificationImplBase serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_NOTIFY_DEADLINE:
          serviceImpl.notifyDeadline((shopping_list.ShoppingListOuterClass.Product) request,
              (io.grpc.stub.StreamObserver<shopping_list.ShoppingListOuterClass.Response>) responseObserver);
          break;
        case METHODID_NOTIFY_RUN_OUT:
          serviceImpl.notifyRunOut((shopping_list.ShoppingListOuterClass.Product) request,
              (io.grpc.stub.StreamObserver<shopping_list.ShoppingListOuterClass.Response>) responseObserver);
          break;
        default:
          throw new AssertionError();
      }
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public io.grpc.stub.StreamObserver<Req> invoke(
        io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        default:
          throw new AssertionError();
      }
    }
  }

  private static abstract class NotificationBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    NotificationBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return notifications.Notifications.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("Notification");
    }
  }

  private static final class NotificationFileDescriptorSupplier
      extends NotificationBaseDescriptorSupplier {
    NotificationFileDescriptorSupplier() {}
  }

  private static final class NotificationMethodDescriptorSupplier
      extends NotificationBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final String methodName;

    NotificationMethodDescriptorSupplier(String methodName) {
      this.methodName = methodName;
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.MethodDescriptor getMethodDescriptor() {
      return getServiceDescriptor().findMethodByName(methodName);
    }
  }

  private static volatile io.grpc.ServiceDescriptor serviceDescriptor;

  public static io.grpc.ServiceDescriptor getServiceDescriptor() {
    io.grpc.ServiceDescriptor result = serviceDescriptor;
    if (result == null) {
      synchronized (NotificationGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new NotificationFileDescriptorSupplier())
              .addMethod(getNotifyDeadlineMethod())
              .addMethod(getNotifyRunOutMethod())
              .build();
        }
      }
    }
    return result;
  }
}
