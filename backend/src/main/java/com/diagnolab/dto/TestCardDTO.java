package com.diagnolab.dto;

import com.diagnolab.entity.LabTest.SampleType;

public class TestCardDTO {

  private Long id;
  private String name;
  private String description;
  private double price;
  private SampleType sampleType;

  public TestCardDTO(Long id, String name, String description, double price, SampleType sampleType) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.sampleType = sampleType;
  }

  public TestCardDTO() {
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getname() {
    return name;
  }

  public void setname(String name) {
    this.name = name;
  }

  public String getdescription() {
    return description;
  }

  public void setdescription(String description) {
    this.description = description;
  }

  public double getprice() {
    return price;
  }

  public void setprice(double price) {
    this.price = price;
  }

  public SampleType getSampleType() {
    return sampleType;
  }

  public void setSampleType(SampleType sampleType) {
    this.sampleType = sampleType;
  }

  @Override
  public int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + ((id == null) ? 0 : id.hashCode());
    result = prime * result + ((name == null) ? 0 : name.hashCode());
    result = prime * result + ((description == null) ? 0 : description.hashCode());
    long temp;
    temp = Double.doubleToLongBits(price);
    result = prime * result + (int) (temp ^ (temp >>> 32));
    result = prime * result + ((sampleType == null) ? 0 : sampleType.hashCode());
    return result;
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj)
      return true;
    if (obj == null)
      return false;
    if (getClass() != obj.getClass())
      return false;
    TestCardDTO other = (TestCardDTO) obj;
    if (id == null) {
      if (other.id != null)
        return false;
    } else if (!id.equals(other.id))
      return false;
    if (name == null) {
      if (other.name != null)
        return false;
    } else if (!name.equals(other.name))
      return false;
    if (description == null) {
      if (other.description != null)
        return false;
    } else if (!description.equals(other.description))
      return false;
    if (Double.doubleToLongBits(price) != Double.doubleToLongBits(other.price))
      return false;
    if (sampleType != other.sampleType)
      return false;
    return true;
  }

  @Override
  public String toString() {
    return "TestsDTO [id=" + id + ", name=" + name + ", description=" + description + ", price="
        + price + ", sampleType=" + sampleType + "]";
  }

}
