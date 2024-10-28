output "server_frontend_public_ip" {
  value = try(aws_instance.ec2_tf_ansible.public_ip, "")
}

