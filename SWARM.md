# Deploy on Docker Swarm
1) Use `terraform apply` to run N=3 instances.
2) Connect with ssh to N=3 EC2 instances. 
Use the command with the public ip obtained from terraform output, for example in threee different terminals, use:

first shell: `ssh -i labsuser.pem ec2-user@34.234.91.106` (change the ip)

second shell: `ssh -i labsuser.pem ec2-user@54.172.40.156` (change the ip)

third shell: `ssh -i labsuser.pem ec2-user@54.211.66.163` (change the ip)

2) On one of the EC2 instance, use `ifconfig` and copy the ip named "eth0", for example "172.31.30.79". Example output:

```console
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 9001
inet 172.31.30.79  netmask 255.255.240.0  broadcast 172.31.31.255
inet6 fe80::860:85ff:fe5f:7fe9  prefixlen 64  scopeid 0x20<link>
ether 0a:60:85:5f:7f:e9  txqueuelen 1000  (Ethernet)
RX packets 146396  bytes 198264893 (189.0 MiB)
RX errors 0  dropped 0  overruns 0  frame 0
TX packets 16065  bytes 1612072 (1.5 MiB)
TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

3) On the same EC2 instance, use (use the correct ip)


    sudo docker swarm init --advertise-addr 172.31.30.79

To add a worker to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-1cvss9vzvptthzxbwzpvar0jvs7p9vy4gncvc77nxq627m3qok-bdlvgq9pl0ppgh0dbvxr3h3dw 172.31.30.79:2377

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.

4) On the other EC2 instance, use the command obtained at the previous step

    
    docker swarm join --token SWMTKN-1-1cvss9vzvptthzxbwzpvar0jvs7p9vy4gncvc77nxq627m3qok-bdlvgq9pl0ppgh0dbvxr3h3dw 172.31.30.79:2377

5) Check active nodes with `docker node ls`. Example Output:
```console
   ID                            HOSTNAME                        STATUS    AVAILABILITY   MANAGER STATUS   ENGINE VERSION
   qy3mkh9o7gnis0fj8pwxvoef7     ip-172-31-21-117.ec2.internal   Ready     Active                          20.10.17
   2h8rwv95gfnc8johu5ywop5ea     ip-172-31-24-128.ec2.internal   Ready     Active                          20.10.17
   uoh3cqbl1p8qke3orrir05nnc *   ip-172-31-30-79.ec2.internal    Ready     Active         Leader           20.10.17
```

6) NOW WHAT?