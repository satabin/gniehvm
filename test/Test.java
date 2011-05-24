interface Itf {}
public class Test implements Itf {
  public int m(String s, int i) {
    System.out.println(s);
    int j = i * 3;
    return j;
  }
}
