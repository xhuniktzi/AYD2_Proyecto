"""init migrate

Revision ID: 7abdf54262a0
Revises: 
Create Date: 2024-09-06 23:51:10.839733

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7abdf54262a0'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=80), nullable=False),
    sa.Column('password', sa.String(length=200), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('username')
    )
    op.create_table('trip',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('origin', sa.String(length=120), nullable=False),
    sa.Column('destination', sa.String(length=120), nullable=False),
    sa.Column('status', sa.String(length=50), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('trip')
    op.drop_table('user')
    # ### end Alembic commands ###
