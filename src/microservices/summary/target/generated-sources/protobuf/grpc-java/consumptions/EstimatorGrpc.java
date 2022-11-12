package consumptions;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 * <pre>
 * service which can be executed
 * </pre>
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler (version 1.50.2)",
    comments = "Source: consumptions.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class EstimatorGrpc {

  private EstimatorGrpc() {}

  public static final String SERVICE_NAME = "consumptions.Estimator";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<consumptions.Consumptions.PredictRequest,
      consumptions.Consumptions.PredictedDataList> getPredictMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "Predict",
      requestType = consumptions.Consumptions.PredictRequest.class,
      responseType = consumptions.Consumptions.PredictedDataList.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<consumptions.Consumptions.PredictRequest,
      consumptions.Consumptions.PredictedDataList> getPredictMethod() {
    io.grpc.MethodDescriptor<consumptions.Consumptions.PredictRequest, consumptions.Consumptions.PredictedDataList> getPredictMethod;
    if ((getPredictMethod = EstimatorGrpc.getPredictMethod) == null) {
      synchronized (EstimatorGrpc.class) {
        if ((getPredictMethod = EstimatorGrpc.getPredictMethod) == null) {
          EstimatorGrpc.getPredictMethod = getPredictMethod =
              io.grpc.MethodDescriptor.<consumptions.Consumptions.PredictRequest, consumptions.Consumptions.PredictedDataList>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "Predict"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  consumptions.Consumptions.PredictRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  consumptions.Consumptions.PredictedDataList.getDefaultInstance()))
              .setSchemaDescriptor(new EstimatorMethodDescriptorSupplier("Predict"))
              .build();
        }
      }
    }
    return getPredictMethod;
  }

  private static volatile io.grpc.MethodDescriptor<consumptions.Consumptions.TrainRequest,
      consumptions.Consumptions.TrainResponse> getTrainModelMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "TrainModel",
      requestType = consumptions.Consumptions.TrainRequest.class,
      responseType = consumptions.Consumptions.TrainResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<consumptions.Consumptions.TrainRequest,
      consumptions.Consumptions.TrainResponse> getTrainModelMethod() {
    io.grpc.MethodDescriptor<consumptions.Consumptions.TrainRequest, consumptions.Consumptions.TrainResponse> getTrainModelMethod;
    if ((getTrainModelMethod = EstimatorGrpc.getTrainModelMethod) == null) {
      synchronized (EstimatorGrpc.class) {
        if ((getTrainModelMethod = EstimatorGrpc.getTrainModelMethod) == null) {
          EstimatorGrpc.getTrainModelMethod = getTrainModelMethod =
              io.grpc.MethodDescriptor.<consumptions.Consumptions.TrainRequest, consumptions.Consumptions.TrainResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "TrainModel"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  consumptions.Consumptions.TrainRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  consumptions.Consumptions.TrainResponse.getDefaultInstance()))
              .setSchemaDescriptor(new EstimatorMethodDescriptorSupplier("TrainModel"))
              .build();
        }
      }
    }
    return getTrainModelMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static EstimatorStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<EstimatorStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<EstimatorStub>() {
        @java.lang.Override
        public EstimatorStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new EstimatorStub(channel, callOptions);
        }
      };
    return EstimatorStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static EstimatorBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<EstimatorBlockingStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<EstimatorBlockingStub>() {
        @java.lang.Override
        public EstimatorBlockingStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new EstimatorBlockingStub(channel, callOptions);
        }
      };
    return EstimatorBlockingStub.newStub(factory, channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static EstimatorFutureStub newFutureStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<EstimatorFutureStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<EstimatorFutureStub>() {
        @java.lang.Override
        public EstimatorFutureStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new EstimatorFutureStub(channel, callOptions);
        }
      };
    return EstimatorFutureStub.newStub(factory, channel);
  }

  /**
   * <pre>
   * service which can be executed
   * </pre>
   */
  public static abstract class EstimatorImplBase implements io.grpc.BindableService {

    /**
     * <pre>
     * This function should receive and return a stream of object
     *  rpc Predict(stream BoughtProduct) returns (stream BuyMore);
     * </pre>
     */
    public void predict(consumptions.Consumptions.PredictRequest request,
        io.grpc.stub.StreamObserver<consumptions.Consumptions.PredictedDataList> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getPredictMethod(), responseObserver);
    }

    /**
     */
    public void trainModel(consumptions.Consumptions.TrainRequest request,
        io.grpc.stub.StreamObserver<consumptions.Consumptions.TrainResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getTrainModelMethod(), responseObserver);
    }

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
          .addMethod(
            getPredictMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                consumptions.Consumptions.PredictRequest,
                consumptions.Consumptions.PredictedDataList>(
                  this, METHODID_PREDICT)))
          .addMethod(
            getTrainModelMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                consumptions.Consumptions.TrainRequest,
                consumptions.Consumptions.TrainResponse>(
                  this, METHODID_TRAIN_MODEL)))
          .build();
    }
  }

  /**
   * <pre>
   * service which can be executed
   * </pre>
   */
  public static final class EstimatorStub extends io.grpc.stub.AbstractAsyncStub<EstimatorStub> {
    private EstimatorStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected EstimatorStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new EstimatorStub(channel, callOptions);
    }

    /**
     * <pre>
     * This function should receive and return a stream of object
     *  rpc Predict(stream BoughtProduct) returns (stream BuyMore);
     * </pre>
     */
    public void predict(consumptions.Consumptions.PredictRequest request,
        io.grpc.stub.StreamObserver<consumptions.Consumptions.PredictedDataList> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getPredictMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void trainModel(consumptions.Consumptions.TrainRequest request,
        io.grpc.stub.StreamObserver<consumptions.Consumptions.TrainResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getTrainModelMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   * <pre>
   * service which can be executed
   * </pre>
   */
  public static final class EstimatorBlockingStub extends io.grpc.stub.AbstractBlockingStub<EstimatorBlockingStub> {
    private EstimatorBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected EstimatorBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new EstimatorBlockingStub(channel, callOptions);
    }

    /**
     * <pre>
     * This function should receive and return a stream of object
     *  rpc Predict(stream BoughtProduct) returns (stream BuyMore);
     * </pre>
     */
    public consumptions.Consumptions.PredictedDataList predict(consumptions.Consumptions.PredictRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getPredictMethod(), getCallOptions(), request);
    }

    /**
     */
    public consumptions.Consumptions.TrainResponse trainModel(consumptions.Consumptions.TrainRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getTrainModelMethod(), getCallOptions(), request);
    }
  }

  /**
   * <pre>
   * service which can be executed
   * </pre>
   */
  public static final class EstimatorFutureStub extends io.grpc.stub.AbstractFutureStub<EstimatorFutureStub> {
    private EstimatorFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected EstimatorFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new EstimatorFutureStub(channel, callOptions);
    }

    /**
     * <pre>
     * This function should receive and return a stream of object
     *  rpc Predict(stream BoughtProduct) returns (stream BuyMore);
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<consumptions.Consumptions.PredictedDataList> predict(
        consumptions.Consumptions.PredictRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getPredictMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<consumptions.Consumptions.TrainResponse> trainModel(
        consumptions.Consumptions.TrainRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getTrainModelMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_PREDICT = 0;
  private static final int METHODID_TRAIN_MODEL = 1;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final EstimatorImplBase serviceImpl;
    private final int methodId;

    MethodHandlers(EstimatorImplBase serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_PREDICT:
          serviceImpl.predict((consumptions.Consumptions.PredictRequest) request,
              (io.grpc.stub.StreamObserver<consumptions.Consumptions.PredictedDataList>) responseObserver);
          break;
        case METHODID_TRAIN_MODEL:
          serviceImpl.trainModel((consumptions.Consumptions.TrainRequest) request,
              (io.grpc.stub.StreamObserver<consumptions.Consumptions.TrainResponse>) responseObserver);
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

  private static abstract class EstimatorBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    EstimatorBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return consumptions.Consumptions.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("Estimator");
    }
  }

  private static final class EstimatorFileDescriptorSupplier
      extends EstimatorBaseDescriptorSupplier {
    EstimatorFileDescriptorSupplier() {}
  }

  private static final class EstimatorMethodDescriptorSupplier
      extends EstimatorBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final String methodName;

    EstimatorMethodDescriptorSupplier(String methodName) {
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
      synchronized (EstimatorGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new EstimatorFileDescriptorSupplier())
              .addMethod(getPredictMethod())
              .addMethod(getTrainModelMethod())
              .build();
        }
      }
    }
    return result;
  }
}
