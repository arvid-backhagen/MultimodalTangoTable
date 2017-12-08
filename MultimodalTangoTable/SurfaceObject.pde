class SurfaceObject extends TuiObject
{
  int deg;

  SurfaceObject(int s_id,int f_id) 
  {
    super(s_id, f_id);
  }

  void update(int x, int y, float a) 
  {
    super.update(x, y, a);
    deg = (int)(angle*180/PI);
  }

  void draw() 
  {
    noStroke();
    fill(100);   

    pushMatrix();
    translate(xpos, ypos);
    rotate(angle);
    rect(0,0,100,100);
    popMatrix();

    fill(255);
    text(fiducial_id + ": " + deg, xpos - 20, ypos);
  }
}
