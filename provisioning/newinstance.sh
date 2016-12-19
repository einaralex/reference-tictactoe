INSTANCE_ID=$(aws ec2 run-instances  --user-data file://initinstance.sh --image-id ami-9398d3e0 --security-group-ids 	sg-6cde530a --count 1 --instance-type t2.micro --key-name launch-wizard-1 --query 'Instances[0].InstanceId'  --output=text)
echo ${INSTANCE_ID} > .provisioning/instance-id.txt
