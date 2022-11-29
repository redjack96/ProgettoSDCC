# Install ansible
Use the python installation of the system (make sure you're not in a virtual environment, e.g. there is not a (venv) at the start of the command line)

```
python -m pip install --user ansible
```

# My Ansible Tutorial
## Create the hosts file
Get the ip addresses of the VM (EC2) from terraform (in the terraform folder)

```
terraform$ terraform apply
```

This is an example output:

```
public_ip = [
    [
        "34.200.212.64",
        "44.193.6.37",
        "44.198.58.20",
    ],
]
```

Create an "hosts.ini" file (see ansible folder), with a [title] and copy the hosts obtained in the previous step:

```
[hosts]
34.200.212.64
44.193.6.37
44.198.58.20
```
This is also called **Inventory file**. Now we have used .ini for the inventory file, but Ansible is also compatible with .yml format. The yml format is easier to read, especially when you add variables only valid for certain host.
[optional] To check that ansible reads the file, use (from ansible folder)

```
ansible$ ansible all --list-hosts -i hosts.ini
```

Where -i option is the inventory file. Example output:

```
hosts (3):
  34.200.212.64
  44.193.6.37
  44.198.58.20
```

## Ping to all the VM
Ansible connects via ssh to the ec2 VM, so it needs the private-key (.pem file) and the user, because it is different from the control-node (our PC)
```
ansible$ ansible all -m ping -i hosts.ini --private-key ../terraform/labsuser.pem -u ec2-user
```

# Ansible inventory with YAML
Inventories allow Ansible to manage many remote hosts with A SINGLE COMMAND! It also reduces the command line option needed, for example the -u or --private-key options can be inside the inventory, and are no more needed in the ansible command.
Create a `inventory.yaml` file with the following content

```
ec2: # group name
  hosts:
    vm01:
      ansible_host: 34.200.212.64
    vm02:
      ansible_host: 44.193.6.37
    vm03:
      ansible_host: 44.198.58.20
  vars: # variables valid for all hosts check here for more: 
    ansible_user: ec2-user
    ansible_ssh_private_key_file: ../terraform/labsuser.pem
```
Note the indentation of the variables: these vars are valid for all the hosts in the 'ec2' group. For more variables, see [https://docs.ansible.com/ansible/latest/inventory_guide/intro_inventory.html#variables-in-inventory](https://docs.ansible.com/ansible/latest/inventory_guide/intro_inventory.html#variables-in-inventory)

To encrypt sensitive information, use Ansible Vaults: [https://docs.ansible.com/ansible/latest/vault_guide/vault.html#vault](https://docs.ansible.com/ansible/latest/vault_guide/vault.html#vault)

Now the command is shorter:

```
ansible$ ansible ec2 -m ping -i inventory.yaml
```

# Ansible Playbook
An Ansible Playbook automates repetitive tasks. For us, it is useful to automate the ssh copying of config.properties and docker-stack.yml files to all the EC2 VMs.
We can also use it to create the docker swarm, join other EC2 VMs to the leader, create networks and volumes and finally start the microservice application.

Create a `playbook.yaml` with the following content (You can download the Ansible Plugin to aid you with IntelliJ):

```
- name: copy files to ec2
  hosts: ec2
  connection: ssh
  tasks:
    - name: copy ec2config.properties as config.properties
      copy:
        src: ../terraform/ec2config.properties
        dest: ~/config.properties
    - name: copy docker-stack.yml as docker-stack.yml
      copy:
        src: ../docker-stack.yml
        dest: ~/docker-stack.yml
```

To run this playbook, use:

```
ansible$ ansible-playbook playbook.yaml -i inventory.yaml
```