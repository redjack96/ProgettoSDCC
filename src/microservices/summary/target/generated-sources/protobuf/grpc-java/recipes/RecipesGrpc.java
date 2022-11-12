package recipes;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 * <pre>
 * Services that can be executed
 * </pre>
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler (version 1.50.2)",
    comments = "Source: recipes.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class RecipesGrpc {

  private RecipesGrpc() {}

  public static final String SERVICE_NAME = "recipes.Recipes";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<recipes.RecipesOuterClass.IngredientsList,
      recipes.RecipesOuterClass.RecipeList> getGetRecipesFromIngredientsMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetRecipesFromIngredients",
      requestType = recipes.RecipesOuterClass.IngredientsList.class,
      responseType = recipes.RecipesOuterClass.RecipeList.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<recipes.RecipesOuterClass.IngredientsList,
      recipes.RecipesOuterClass.RecipeList> getGetRecipesFromIngredientsMethod() {
    io.grpc.MethodDescriptor<recipes.RecipesOuterClass.IngredientsList, recipes.RecipesOuterClass.RecipeList> getGetRecipesFromIngredientsMethod;
    if ((getGetRecipesFromIngredientsMethod = RecipesGrpc.getGetRecipesFromIngredientsMethod) == null) {
      synchronized (RecipesGrpc.class) {
        if ((getGetRecipesFromIngredientsMethod = RecipesGrpc.getGetRecipesFromIngredientsMethod) == null) {
          RecipesGrpc.getGetRecipesFromIngredientsMethod = getGetRecipesFromIngredientsMethod =
              io.grpc.MethodDescriptor.<recipes.RecipesOuterClass.IngredientsList, recipes.RecipesOuterClass.RecipeList>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetRecipesFromIngredients"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  recipes.RecipesOuterClass.IngredientsList.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  recipes.RecipesOuterClass.RecipeList.getDefaultInstance()))
              .setSchemaDescriptor(new RecipesMethodDescriptorSupplier("GetRecipesFromIngredients"))
              .build();
        }
      }
    }
    return getGetRecipesFromIngredientsMethod;
  }

  private static volatile io.grpc.MethodDescriptor<recipes.RecipesOuterClass.RecipesRequest,
      recipes.RecipesOuterClass.RecipeList> getGetRecipesFromPantryMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetRecipesFromPantry",
      requestType = recipes.RecipesOuterClass.RecipesRequest.class,
      responseType = recipes.RecipesOuterClass.RecipeList.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<recipes.RecipesOuterClass.RecipesRequest,
      recipes.RecipesOuterClass.RecipeList> getGetRecipesFromPantryMethod() {
    io.grpc.MethodDescriptor<recipes.RecipesOuterClass.RecipesRequest, recipes.RecipesOuterClass.RecipeList> getGetRecipesFromPantryMethod;
    if ((getGetRecipesFromPantryMethod = RecipesGrpc.getGetRecipesFromPantryMethod) == null) {
      synchronized (RecipesGrpc.class) {
        if ((getGetRecipesFromPantryMethod = RecipesGrpc.getGetRecipesFromPantryMethod) == null) {
          RecipesGrpc.getGetRecipesFromPantryMethod = getGetRecipesFromPantryMethod =
              io.grpc.MethodDescriptor.<recipes.RecipesOuterClass.RecipesRequest, recipes.RecipesOuterClass.RecipeList>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetRecipesFromPantry"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  recipes.RecipesOuterClass.RecipesRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  recipes.RecipesOuterClass.RecipeList.getDefaultInstance()))
              .setSchemaDescriptor(new RecipesMethodDescriptorSupplier("GetRecipesFromPantry"))
              .build();
        }
      }
    }
    return getGetRecipesFromPantryMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static RecipesStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<RecipesStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<RecipesStub>() {
        @java.lang.Override
        public RecipesStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new RecipesStub(channel, callOptions);
        }
      };
    return RecipesStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static RecipesBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<RecipesBlockingStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<RecipesBlockingStub>() {
        @java.lang.Override
        public RecipesBlockingStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new RecipesBlockingStub(channel, callOptions);
        }
      };
    return RecipesBlockingStub.newStub(factory, channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static RecipesFutureStub newFutureStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<RecipesFutureStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<RecipesFutureStub>() {
        @java.lang.Override
        public RecipesFutureStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new RecipesFutureStub(channel, callOptions);
        }
      };
    return RecipesFutureStub.newStub(factory, channel);
  }

  /**
   * <pre>
   * Services that can be executed
   * </pre>
   */
  public static abstract class RecipesImplBase implements io.grpc.BindableService {

    /**
     * <pre>
     *TODO
     * </pre>
     */
    public void getRecipesFromIngredients(recipes.RecipesOuterClass.IngredientsList request,
        io.grpc.stub.StreamObserver<recipes.RecipesOuterClass.RecipeList> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetRecipesFromIngredientsMethod(), responseObserver);
    }

    /**
     * <pre>
     * need to redirect request to storage to get pantry
     * </pre>
     */
    public void getRecipesFromPantry(recipes.RecipesOuterClass.RecipesRequest request,
        io.grpc.stub.StreamObserver<recipes.RecipesOuterClass.RecipeList> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetRecipesFromPantryMethod(), responseObserver);
    }

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
          .addMethod(
            getGetRecipesFromIngredientsMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                recipes.RecipesOuterClass.IngredientsList,
                recipes.RecipesOuterClass.RecipeList>(
                  this, METHODID_GET_RECIPES_FROM_INGREDIENTS)))
          .addMethod(
            getGetRecipesFromPantryMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                recipes.RecipesOuterClass.RecipesRequest,
                recipes.RecipesOuterClass.RecipeList>(
                  this, METHODID_GET_RECIPES_FROM_PANTRY)))
          .build();
    }
  }

  /**
   * <pre>
   * Services that can be executed
   * </pre>
   */
  public static final class RecipesStub extends io.grpc.stub.AbstractAsyncStub<RecipesStub> {
    private RecipesStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected RecipesStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new RecipesStub(channel, callOptions);
    }

    /**
     * <pre>
     *TODO
     * </pre>
     */
    public void getRecipesFromIngredients(recipes.RecipesOuterClass.IngredientsList request,
        io.grpc.stub.StreamObserver<recipes.RecipesOuterClass.RecipeList> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetRecipesFromIngredientsMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * need to redirect request to storage to get pantry
     * </pre>
     */
    public void getRecipesFromPantry(recipes.RecipesOuterClass.RecipesRequest request,
        io.grpc.stub.StreamObserver<recipes.RecipesOuterClass.RecipeList> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetRecipesFromPantryMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   * <pre>
   * Services that can be executed
   * </pre>
   */
  public static final class RecipesBlockingStub extends io.grpc.stub.AbstractBlockingStub<RecipesBlockingStub> {
    private RecipesBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected RecipesBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new RecipesBlockingStub(channel, callOptions);
    }

    /**
     * <pre>
     *TODO
     * </pre>
     */
    public recipes.RecipesOuterClass.RecipeList getRecipesFromIngredients(recipes.RecipesOuterClass.IngredientsList request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetRecipesFromIngredientsMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * need to redirect request to storage to get pantry
     * </pre>
     */
    public recipes.RecipesOuterClass.RecipeList getRecipesFromPantry(recipes.RecipesOuterClass.RecipesRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetRecipesFromPantryMethod(), getCallOptions(), request);
    }
  }

  /**
   * <pre>
   * Services that can be executed
   * </pre>
   */
  public static final class RecipesFutureStub extends io.grpc.stub.AbstractFutureStub<RecipesFutureStub> {
    private RecipesFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected RecipesFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new RecipesFutureStub(channel, callOptions);
    }

    /**
     * <pre>
     *TODO
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<recipes.RecipesOuterClass.RecipeList> getRecipesFromIngredients(
        recipes.RecipesOuterClass.IngredientsList request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetRecipesFromIngredientsMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * need to redirect request to storage to get pantry
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<recipes.RecipesOuterClass.RecipeList> getRecipesFromPantry(
        recipes.RecipesOuterClass.RecipesRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetRecipesFromPantryMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_GET_RECIPES_FROM_INGREDIENTS = 0;
  private static final int METHODID_GET_RECIPES_FROM_PANTRY = 1;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final RecipesImplBase serviceImpl;
    private final int methodId;

    MethodHandlers(RecipesImplBase serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_GET_RECIPES_FROM_INGREDIENTS:
          serviceImpl.getRecipesFromIngredients((recipes.RecipesOuterClass.IngredientsList) request,
              (io.grpc.stub.StreamObserver<recipes.RecipesOuterClass.RecipeList>) responseObserver);
          break;
        case METHODID_GET_RECIPES_FROM_PANTRY:
          serviceImpl.getRecipesFromPantry((recipes.RecipesOuterClass.RecipesRequest) request,
              (io.grpc.stub.StreamObserver<recipes.RecipesOuterClass.RecipeList>) responseObserver);
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

  private static abstract class RecipesBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    RecipesBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return recipes.RecipesOuterClass.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("Recipes");
    }
  }

  private static final class RecipesFileDescriptorSupplier
      extends RecipesBaseDescriptorSupplier {
    RecipesFileDescriptorSupplier() {}
  }

  private static final class RecipesMethodDescriptorSupplier
      extends RecipesBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final String methodName;

    RecipesMethodDescriptorSupplier(String methodName) {
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
      synchronized (RecipesGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new RecipesFileDescriptorSupplier())
              .addMethod(getGetRecipesFromIngredientsMethod())
              .addMethod(getGetRecipesFromPantryMethod())
              .build();
        }
      }
    }
    return result;
  }
}
