---
title: 点分治优化树上连通块DP
tags: 点分治 dp
---

# qyc博客学习2-点分治优化树上连通块DP

qyc只摆了一个优化连通块背包dp的例题,所以我理解并不透彻\(

#### 概念

有时我们处理树上连通块,由于在树上,对于包含根的连通块,连通块若不包含父亲则一定不能包含儿子,根据这个性质,我们可以把dp进行不重不漏的划分,选这个父亲的方案或不选的方案,从而可以直接将对应状态直接合并来代替困难的dp合并.

既然划分成选或不选根,就容易理解通过点分治进行根的选取从而达到优化效果了

适用于解决合并困难而插入一个点较简单的计数dp (也可能不是计数?但这种划分还能怎么用没见过)

#### 例题[Tree Cutting - HDU 5909 - Virtual Judge (vjudge.net)](https://vjudge.net/problem/HDU-5909):

##### 题意:

点有点权,对每一个k求点权亦或和为k的连通块个数

##### 解法:

首先对于每个分治部分处理:

dp[j]为当前亦或和为j的连通块个数

一开始dp[j]全为空,dp[0]=1,即都不选时亦或和为0

dfs当前点分治的部分,进入一个节点就有两种情况

- 不选这个节点,则这个点的儿子也不能选了,那么答案仍然是是其父亲传下来的dp[j],我们叫他dp0[j]

- 选这个节点,那么我们把父亲传下来的答案dp[j]=dp[j^w],w为当前点权,即相当于选上了这个点的影响,然后继续dfs,在这个修改后的dp[]上算子孙的答案,给儿孙们处理完了叫它dp1[j]

最后这个点的答案就为dp[j]=dp0[j]+dp1[j],可以发现正好对应了所有情况.

对于每个分治重心,dfs相当于带着dp[]在树上转一圈,便得到了这个分治部分的答案.

我们还需要给dp[0]--,因为这个分治重心需要强制选,否则所有节点均不选的情况会在每个分治重心都算一次,我们把它剔除,合并完所有分治重心的答案后再dp[0]++

然后我们要把所有分治重心的答案合并,因为每个分治重心的答案都是不互相包含的,所以就直接各个重心答案对应位置相加即最终答案.

给一份代码:

```cpp
#include<iostream>
#include<cstring>
using namespace std;
const int N=1600,P=1e9+7;
int max(int a,int b){
    return a>b?a:b;
}
struct Edge{
    int u,v,next;
} edges[N*2];
int head[N],ecnt=0;
void add_edge(int u,int v){
    edges[++ecnt].u=u;
    edges[ecnt].v=v;
    edges[ecnt].next=head[u];
    head[u]=ecnt;
}
int w[N];
int n,m;
int rt,rtmaxson,total;
int siz[N];
bool vis[N];
void findroot(int u,int f){
    siz[u]=1;
    int maxp=0;
    for(int i=head[u];i;i=edges[i].next){
        int v=edges[i].v;
        if(vis[v]||v==f)continue;
        findroot(v,u);
        siz[u]+=siz[v];
        maxp=max(maxp,siz[v]);
    }
    maxp=max(maxp,total-siz[u]);
    if(maxp<rtmaxson){
        rtmaxson=maxp;
        rt=u;
    }
}
int dp[N],cdp[N][N];
void dfs(int u,int f){
    for(int i=0;i<m;i++){
        cdp[u][i]=dp[i];
    }
    for(int i=0;i<m;i++){
        // dp[i^w[u]]=(cdp[u][i^w[u]]+cdp[u][i])%P;
        dp[i^w[u]]=cdp[u][i];
    }
    for(int i=head[u];i;i=edges[i].next){
        int v=edges[i].v;
        if(v==f||vis[v])continue;
        dfs(v,u);
    }
    for(int i=0;i<m;i++){
        dp[i]=(dp[i]+cdp[u][i])%P;
    }
}
int adp[N][N];
void dfz(int u,int f){
    dp[0]=1;
    dfs(u,0);
    dp[0]--;
    for(int i=0;i<m;i++){
        adp[u][i]=dp[i];
        dp[i]=0;
    }
    vis[u]=true;
    for(int i=head[u];i;i=edges[i].next){
        int v=edges[i].v;
        if(vis[v])continue;
        total=siz[v];
        rt=0,rtmaxson=1e9;
        findroot(v,0);
        dfz(rt,u);
    }
}
void solve(int t){
    cin>>n>>m;
    for(int i=1;i<=n;i++)cin>>w[i];
    ecnt=0;
    memset(head,0,sizeof(head));
    memset(vis,0,sizeof(vis));
    for(int i=1;i<n;i++){
        int u,v;
        cin>>u>>v;
        add_edge(u,v);
        add_edge(v,u);
    }
    rt=0,total=n,rtmaxson=1e9;
    findroot(1,0);
    memset(dp,0,sizeof(dp));
    dfz(1,0);
    for(int i=1;i<=n;i++){
        for(int j=0;j<m;j++){
            dp[j]=(dp[j]+adp[i][j])%P;
        }
    }
    for(int i=0;i<m;i++){
        cout<<dp[i];
        if(i!=m-1)cout<<" ";
    }
    cout<<endl;
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(0);
    int t;
    cin>>t;
    while(t--){
        solve(t);
    }
    return 0;
}
```

#### PS:

HDU难用极了,建议写完直接用我的拍一拍就行了

如果你想在HDU上过这个题,注意一下几点

- CE:HDU不支持(结构体名){...}的创建结构体方法,且iostream里并没有min/max

- PE(Presentation Error):最恶心的地方,每一行末尾不能有空格,但整个程序最后要有一个空行

- WA:你写错了

#### 参考:

[树分治学习笔记 - ShanLunjiaJian的blog - 洛谷博客 (luogu.com.cn)](https://www.luogu.com.cn/blog/YouAreDalao/shu-fen-zhi-notes)包含这个内容,不过不如下面那个详细

[点分治优化dp学习笔记 - ShanLunjiaJian的blog - 洛谷博客 (luogu.com.cn)](https://www.luogu.com.cn/blog/YouAreDalao/dian-fen-zhi-you-hua-dp)对此有更抽象泛华的解释

[hdu5909 （点分治+dfs序上树形DP_TeJoy的博客-CSDN博客](https://blog.csdn.net/weixin_45539557/article/details/115713573)讲了一种dfs序满足连通块限制的trick
