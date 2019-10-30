# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class ZeroDateTimeField(models.DateTimeField):
    def get_db_prep_value(self, value, connection, prepared=False):
        value = super(ZeroDateTimeField, self).get_db_prep_value(value, connection, prepared)
        if value is None:
            return "0000-00-00 00:00:00"
        return value
class ZeroDateField(models.DateField):
    def get_db_prep_value(self, value, connection, prepared=False):
        value = super(ZeroDateField, self).get_db_prep_value(value, connection, prepared)
        if value is None:
            return "0000-00-00"
        return value


class Accounts(models.Model):
    name = models.CharField(unique=True, max_length=13)
    password = models.CharField(max_length=128)
    salt = models.CharField(max_length=128, blank=True, null=True)
    pin = models.CharField(max_length=10, blank=True, null=True)
    pic = models.CharField(max_length=26, blank=True, null=True)
    loggedin = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(250)])
    lastlogin = models.DateTimeField(blank=True, null=True)
    createdat = models.DateTimeField(auto_now_add=True)
    birthday = ZeroDateField(blank=True, null=True)
    banned = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(250)])
    banreason = models.TextField(blank=True, null=True)
    gm = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(250)])
    macs = models.TextField(blank=True, null=True)
    nxcredit = models.IntegerField(db_column='nxCredit', blank=True, null=True)  # Field name made lowercase.
    maplepoint = models.IntegerField(db_column='maplePoint', blank=True, null=True)  # Field name made lowercase.
    nxprepaid = models.IntegerField(db_column='nxPrepaid', blank=True, null=True)  # Field name made lowercase.
    characterslots = models.IntegerField(default=5, validators=[MinValueValidator(0), MaxValueValidator(250)])
    gender = models.IntegerField(default=10, validators=[MinValueValidator(0), MaxValueValidator(250)])
    tempban = ZeroDateTimeField(blank=True, null=True)
    greason = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(250)])
    tos = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(250)])
    sitelogged = models.TextField(blank=True, null=True)
    webadmin = models.IntegerField(default=0, blank=True, null=True)
    nick = models.CharField(max_length=20, blank=True, null=True)
    mute = models.IntegerField(default=0, blank=True, null=True)
    email = models.CharField(max_length=45, blank=True, null=True)
    ip = models.TextField(blank=True, null=True)
    rewardpoints = models.IntegerField(default=0)
    hwid = models.CharField(default='', max_length=12)
    fly = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(250)])

    class Meta:
        db_table = 'accounts'
