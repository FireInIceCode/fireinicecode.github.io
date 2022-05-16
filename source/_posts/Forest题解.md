# The Forest题解

### 题意:

t组询问,每次给两棵n个点的树A和B,求有多少点集满足B树上是一个连通块而A树上是一条链.$n\le1e5, t\le3$ 

### 解法

链比连通块性质更好,从A树角度考虑

#### A是链的解法

这是后面的基础.对于树上的一个连通块,满足V(顶点数)-E(边数)=1,当A是链也就是每条链成了一个区间,于是每次移动区间右端点,数据结构维护左端点,于是可以开一棵线段树,下标i位置表示以链上下标为i的位置为左端点,到当前右端点这一段区间的V-E,因为V-E不可能比1更小,所以维护区间最小值和最小值个数,支持区间加,每次

- `r'=r+1`

- 给1到 r' 加一,对于它们所有都多了 r' 这个点

- 遍历  r' 在B树上的每一条边,若指向的顶点在当前区间内,给这个点到 r' 的这个区间减一,因为左端点在这个区间时点集会包含这条边.

#### 完整解法一 -- 换根

把刚才的解法拓展到树上,维护每个点到根rt的这条路径的V-E,随便一个根,可以 O(n) 求出所有节点的值,然后进行换根,考虑根移动到它的一个儿子时,如图,当根由u到v,v的子树内节点到根的路径要去掉u,v的子树外节点到根路径要加上v,类比链上加一个点两个步骤,就有了以下四个步骤

![示意图](https://raw.githubusercontent.com/FireInIceCode/imgs/main/imgs/202205062307160.png)

1. v 的子树内节点到根路径少了 u 这个点,所以给 v 子树内所有节点$V-E$的值减1

2. 它们也失去了 u 在B树上的边,所以遍历这些边,设一条边连向 w,若 w 在 v 子树内( w 在子树外不会被子树内到根路径包含)把 w 子树加一( w 子树内的点到 u 的路径会包含 w )

3. v 子树外的点到根路径多了 v 这个点,所以给 v 子树外所有点$V-E$的值 +1

4. 它们也拥有了 v 在B树上的边,遍历这些边,设一条边连向 w ,在 w 以 u 为根的意义下 w 的子树到 v 路径包含这条边,给它们减一,此时分两种情况
   
   - w 在 u 到 rt 的路径上( rt 是一开始随便的根), w 有一个儿子包含 u ,叫它 t ,分析发现 w 以 u 为根的子树就是在以 rt 为根的情况下除了 t 的子树的所有点.
   
   - w 不在 u 到 rt 的路径上,此时以 u 为根的子树和以 rt 为根的子树相同,直接给这个子树减一.

根从儿子转移到父亲显然就是把上述步骤所有加一减一取反.

我们发现所有操作都是对一个子树操作(一个子树外可转化为全局-这个子树),所以在dfs序上建线段树,仍然维护区间最小值和最小值个数,支持区间加即可.

根走的路程是A树的欧拉环游,会进入/退出每个点一次,所以进入一个点执行的操作3和4是 O(nlogn) 的,但进入一个点会一起遍历它父亲在B树上的边,那么对于A树上儿子很多的点就会重复遍历B树上的边很多次,如果这个点碰巧在B树上度数也大,那么在执行步骤2的复杂度就$O(n^2) $了

所以要保证每条边只遍历常数次,可以对每个点B树上的边按边指向的点在A树上的 dfs 序排序,并按 dfs 升序/降序遍历A树上的儿子转移,于是步骤2中满足 u 在 v 子树中的边是一个区间,保证了每个边遍历一次.总复杂度就是 O(nlogn) 的了

我们在每个节点

代码:

```c++
#include <algorithm>
#include <cstring>
#include <iostream>
#include <vector>
using namespace std;
const int N = 1e5 + 500, INF = 1e9;
struct Graph {
    vector<int> sons[N];
    int ecnt = 0;
    void add_edge(int u, int v) {
        ecnt++;
        sons[u].push_back(v);
    }
    void clear(int n) {
        ecnt = 0;
        for (int i = 1; i <= n; i++) {
            sons[i].clear();
        }
    }
} at, bt;
struct Seg {
    int minval, mincnt, atag;
} segs[N * 4];
void merge(Seg& x, const Seg& a, const Seg& b) {
    if (a.minval == b.minval) {
        x.mincnt = a.mincnt + b.mincnt;
        x.minval = a.minval;
    } else if (a.minval < b.minval) {
        x.mincnt = a.mincnt;
        x.minval = a.minval;
    } else {
        x.mincnt = b.mincnt;
        x.minval = b.minval;
    }
}
void refresh(int x) {
    merge(segs[x], segs[x << 1], segs[x << 1 | 1]);
}
void tag_add(int x, int v) {
    segs[x].minval += v;
    segs[x].atag += v;
}
void pushdown(int x) {
    if (segs[x].atag) {
        tag_add(x << 1, segs[x].atag);
        tag_add(x << 1 | 1, segs[x].atag);
        segs[x].atag = 0;
    }
}
void rangeadd(int x, int l, int r, int al, int ar, int v) {
    if (al <= l && ar >= r) {
        tag_add(x, v);
        return;
    }
    pushdown(x);
    int mid = (l + r) >> 1;
    if (al <= mid)
        rangeadd(x << 1, l, mid, al, ar, v);
    if (ar > mid)
        rangeadd(x << 1 | 1, mid + 1, r, al, ar, v);
    refresh(x);
}
Seg query(int x, int l, int r, int ql, int qr) {
    if (ql <= l && qr >= r) {
        return segs[x];
    }
    pushdown(x);
    int mid = (l + r) >> 1;
    Seg ans = (Seg){INF, 0, 0};
    if (ql <= mid)
        merge(ans, ans, query(x << 1, l, mid, ql, qr));
    if (qr > mid)
        merge(ans, ans, query(x << 1 | 1, mid + 1, r, ql, qr));
    return ans;
}
int ves[N];
int dfn[N], arr[N], siz[N], dcnt;
bool onpath[N];
void dfs(int u, int f) {
    dfn[u] = ++dcnt;
    arr[dcnt] = u;
    siz[u] = 1;
    ves[u] = ves[f] + 1;
    onpath[u] = true;
    for (int v : bt.sons[u]) {
        if (onpath[v]) {
            ves[u]--;
        }
    }
    for (int v : at.sons[u]) {
        if (v == f)
            continue;
        dfs(v, u);
        siz[u] += siz[v];
    }
    onpath[u] = false;
}
void build(int x, int l, int r) {
    if (l == r) {
        segs[x].mincnt = 1;
        segs[x].atag = 0;
        segs[x].minval = ves[arr[l]];
        return;
    }
    int mid = (l + r) >> 1;
    build(x << 1, l, mid);
    build(x << 1 | 1, mid + 1, r);
    refresh(x);
}
bool cmp(int a, int b) {
    return dfn[a] < dfn[b];
}
bool in(int a, int b) {
    return dfn[b] >= dfn[a] && dfn[b] < dfn[a] + siz[a];
}
void treeadd(int u, int v) {
    rangeadd(1, 1, dcnt, dfn[u], dfn[u] + siz[u] - 1, v);
}
void out() {
    for (int i = 1; i <= dcnt; i++) {
        cout << query(1, 1, dcnt, i, i).minval << " ";
    }
    cout << endl;
}

int moveRoot(int u, int v, int x, int bi) {
    treeadd(v, -1 * x);  // v子树内的点少了u
    //删除u的边
    while (bi < bt.sons[u].size() && dfn[bt.sons[u][bi]] < dfn[v] + siz[v]) {
        if (dfn[bt.sons[u][bi]] >= dfn[v])
            treeadd(bt.sons[u][bi], 1 * x);
        bi++;
    }

    treeadd(1, 1 * x);  // v子树外的点多了v
    treeadd(v, -1 * x);
    //增加v的边
    for (int w : bt.sons[v]) {
        if (in(v, w))
            continue;
        if (u == w) {
            treeadd(v, 1 * x);
            treeadd(1, -1 * x);
        } else if (in(w, u)) {
            int l = 0, r = at.sons[w].size() - 1;
            while (l < r) {
                int mid = (l + r + 1) >> 1;
                if (dfn[at.sons[w][mid]] <= dfn[u]) {
                    l = mid;
                } else {
                    r = mid - 1;
                }
            }
            int t = at.sons[w][l];
            treeadd(t, 1 * x);
            treeadd(1, -1 * x);
        } else {
            treeadd(w, -1 * x);
        }
    }
    return bi;
}
int ans = 0;
void solve(int u, int f) {
    ans += query(1, 1, dcnt, 1, dcnt).mincnt;
    sort(at.sons[u].begin(), at.sons[u].end(), cmp);
    sort(bt.sons[u].begin(), bt.sons[u].end(), cmp);
    int bi = 0;
    for (int v : at.sons[u]) {
        if (v == f)
            continue;
        moveRoot(u, v, 1, bi);
        solve(v, u);
        bi = moveRoot(u, v, -1, bi);
    }
}
void test() {
    memset(segs,0,sizeof(segs));
    ans = 0;
    dcnt = 0;
    int n;
    cin >> n;
    for (int i = 1; i < n; i++) {
        int u, v;
        cin >> u >> v;
        bt.add_edge(u, v);
        bt.add_edge(v, u);
    }
    for (int i = 1; i < n; i++) {
        int u, v;
        cin >> u >> v;
        at.add_edge(u, v);
        at.add_edge(v, u);
    }
    dfs(1, 0);
    build(1, 1, dcnt);
    solve(1, 0);
    cout << (ans - n) / 2 + n << endl;
    at.clear(n);
    bt.clear(n);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        test();
    }
}
```

#### 完整解法二 -- 点分治

仍然考虑个链的做法拓展到树上,在A树进行点分治,首先对于每一层:

- 预处理分治的当前层中所有节点到重心的链在B树上的$V-E$,此时可以顺便把从一个端点在根的路径的答案求出,于是后面仅考虑两端点在不同子树的,也就是说,当处理一棵子树时子树内的点答案正确性无需考虑.
- 按dfs序递增的遍历根在A树上所有儿子,此时遍历到一个点时,维护的$V-E$就是所有点到分治中心的链的值,dfs当前儿子的子树,进入一个点时把答案移动成所有点到当前点的$V-E$,所以就是
  - 给当前子树外的所有点+1
  - 遍历它每一条边,判断这条边是指向节点(设为 w )在当前处理的子树外还是当前节点到根的路径上:
    - 子树外:给 w 的子树-1
    - 子树内到根的路径上:因为我们已经只考虑跨子树的路径,所以只要给当前子树外的点-1即可.

注意每做完一棵子树清空.


