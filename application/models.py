from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
from sqlalchemy import CheckConstraint, ForeignKey
from datetime import datetime
from .database import db


class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=True)


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    active = db.Column(db.Boolean, default=True, nullable=False)

    # Relationship with roles
    roles = db.relationship('Role', secondary='user_roles', backref=db.backref('users', lazy=True))

    # Common user fields
    city = db.Column(db.String(50), nullable=True)

    # Professional-specific fields
    service_type= db.Column(db.Integer, db.ForeignKey('service.id'), nullable=True)  # For professionals
    experience = db.Column(db.Integer, nullable=True)
    bio = db.Column(db.Text, nullable=True)
    verified = db.Column(db.Boolean, default=None,nullable=True)
    verification_document = db.Column(db.String(255), nullable=True)

    # Relationships
    service = db.relationship('Service', foreign_keys=[service_type], backref='professionals')
    service_requests_as_customer = db.relationship('ServiceRequest', foreign_keys='ServiceRequest.customer_id', backref='customer', lazy=True)
    service_requests_as_professional = db.relationship('ServiceRequest', foreign_keys='ServiceRequest.professional_id', backref='professional', lazy=True)


# Association table for many-to-many relationship between Users and Roles
class UserRoles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id', ondelete='CASCADE'))



class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    base_price = db.Column(db.Float, nullable=False)
    time_required = db.Column(db.String(50), nullable=True)

    # Relationship with professionals and service requests


    service_requests = db.relationship('ServiceRequest', backref='service', lazy=True)


class ServiceRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('service.id', ondelete='RESTRICT'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    professional_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='SET NULL'), nullable=True)

    date_requested = db.Column(db.Date,  nullable=False)
    date_completed = db.Column(db.Date, nullable=True)

    address=db.Column(db.Text, nullable=True)
    offered_price=db.Column(db.Integer,nullable=False)
    
    status = db.Column(db.String(20), nullable=False, default='requested')  # requested, assigned, closed, rejected
    
    rating = db.Column(db.Integer, nullable=True)
    remarks = db.Column(db.Text, nullable=True)

    __table_args__ = (
        CheckConstraint(
            "status IN ('requested', 'assigned', 'closed', 'rejected')",
            name='check_service_request_status'
            
        ),
        CheckConstraint("rating >= 1 AND rating <= 5", name='check_rating_range')
    )
