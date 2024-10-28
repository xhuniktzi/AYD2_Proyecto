resource "aws_key_pair" "AyD2-key" {
  key_name   = "tf_ansible" 
  public_key = file("${var.PATH_PUBLIC_KEYPAIR}")
}

resource "aws_security_group" "ayd2-frontend-sg" {
  name   = "ayd2-frontend-sg"
  description = "Security group for EC2 instances and related services"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Allow SSH from anywhere (consider restricting this for security)
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Allow HTTP traffic
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Allow traffic on port 3000 (e.g., for Node.js app)
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]  # Allow all outbound traffic
  }
}

resource "aws_instance" "ec2_tf_ansible" {
  ami             = "ami-0fa00f9c3aad25769"
  instance_type   = "t2.micro"
  key_name        = aws_key_pair.AyD2-key.key_name
  security_groups = [aws_security_group.ayd2-frontend-sg.name] 

    user_data = <<-EOF
              #!/bin/bash
              # Update package list and install Python
              sudo apt update -y
              sudo apt install -y python3
              sudo ln -s /usr/bin/python3 /usr/bin/python  # Create symlink to python3 as 'python'
            EOF

  tags = {
    Name = "EC2 Frontend Instance"
  }
}

resource "local_file" "ansible_inventory" {
  filename = "/ansible/inventory.ini"
  content  = <<-EOF
              [frontend]
              ${aws_instance.ec2_tf_ansible.public_ip} ansible_user=ubuntu ansible_ssh_private_key_file=/root/.ssh/tf-ansible.pem
              EOF
  depends_on = [aws_instance.ec2_tf_ansible]
}