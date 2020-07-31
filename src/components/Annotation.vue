<template>
  <div class="wrapper">
    <div class="text-list">
      <div class="text-item" v-for="i in textList" @click="changeText(i)">
        {{ i }}
      </div>
    </div>
    <div class="annotation-wrapper">
      <div class="label-wrapper">
        <span
          class="label"
          v-for="i in labels"
          :style="{ background: i.color }"
          @click="annotate(i)"
          >{{ i.name }}</span
        >
      </div>
      <div class="text-data" @click="getSelection" v-html="text">
        {{ text }}
      </div>
      <div class="record">
        <el-table
          :data="tableData"
          style="width: 95%;margin:auto;"
          @cell-mouse-enter="rowHover"
          @cell-mouse-leave="rowHoverLeave"
          max-height="350"
        >
          <el-table-column prop="text" label="文本"> </el-table-column>
          <el-table-column
            prop="label"
            label="标签"
            :filters="filters"
            :filter-method="filterTag"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <el-tag close-transition>{{ scope.row.label }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click.native.prevent="deleteRow(scope)">
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
// @ts-ignore
import json from '@/assets/json/demo.js';

@Component
export default class Annotate extends Vue {
  private textTemp: string =
    '原告佡某诉称，要求与被告离婚，夫妻感情已破裂。经审理查明，原、被告于1988年自由恋爱相识，1990年6月登记结婚，婚生一男孩龚某某，婚后初期夫妻感情尚可，后因家庭琐事产生矛盾，导致夫妻感情不和，故原告于2014年3月18日起诉来院。本院认为，婚姻关系的存续应以夫妻感情为基础。原、被告系自主婚姻，婚后双方虽因家庭生活琐事争吵，但并未导致夫妻感情彻底破裂。原告应珍惜来之不易的夫妻感情，考虑家庭及子女的长远利益，放弃离婚念头；被告亦应积极做夫妻和好工作，努力克服自己的缺点和不足，多关心体贴爱人。只要双方多做自我批评、互解互谅，共建美满幸福家庭是完全可能的。';
  private text: string =
    '原告佡某诉称，要求与被告离婚，夫妻感情已破裂。经审理查明，原、被告于1988年自由恋爱相识，1990年6月登记结婚，婚生一男孩龚某某，婚后初期夫妻感情尚可，后因家庭琐事产生矛盾，导致夫妻感情不和，故原告于2014年3月18日起诉来院。本院认为，婚姻关系的存续应以夫妻感情为基础。原、被告系自主婚姻，婚后双方虽因家庭生活琐事争吵，但并未导致夫妻感情彻底破裂。原告应珍惜来之不易的夫妻感情，考虑家庭及子女的长远利益，放弃离婚念头；被告亦应积极做夫妻和好工作，努力克服自己的缺点和不足，多关心体贴爱人。只要双方多做自我批评、互解互谅，共建美满幸福家庭是完全可能的。';
  // private labels: any[] = [
  //   {
  //     id: 1,
  //     name: '标签1',
  //     color: '#DDE6E8',
  //   },
  //   {
  //     id: 2,
  //     name: '标签2',
  //     color: '#1FBC9C',
  //   },
  //   {
  //     id: 3,
  //     name: '标签3',
  //     color: '#DDE6E8',
  //   },
  //   {
  //     id: 4,
  //     name: '标签4',
  //     color: '#1FBC9C',
  //   },
  // ];
  get filters() {
    const arr: any = [];
    this.labels.map((item: any) => {
      let obj = {
        text: item.name,
        value: item.name,
      };
      arr.push(obj);
    });
    return arr;
  }
  private tableData: any[] = [];
  private startOffset: number = 0;
  private endOffset: number = 0;

  get textList() {
    return this.json.texts;
  }

  get labels() {
    const arr: any = [];
    this.json.labels.map((item: any, index: number) => {
      let obj = {
        id: index,
        name: item,
        color: index % 2 === 1 ? '#DDE6E8' : '#1FBC9C',
      };
      arr.push(obj);
    });
    return arr;
  }

  private json = require('@/assets/json/demo.json');

  private mounted() {
    this.textTemp = this.text = this.json.texts[0];
  }

  private changeText(i: any) {
    this.textTemp = this.text = i;
  }

  private annotate(i: any) {
    if (this.endOffset === 0) {
      return;
    }
    const text = this.text.slice(this.startOffset + 1, this.endOffset + 1);
    const obj = {
      text: text,
      label: i.name,
      start: this.startOffset + 1,
      end: this.endOffset + 1,
    };
    this.tableData.push(obj);
    this.endOffset = 0;
  }
  private deleteRow(scope: any) {
    this.tableData.splice(scope.$index, 1);
    this.rowHoverLeave();
  }

  private getSelection() {
    const sel = window.getSelection && window.getSelection(); // 得到selection对象
    let start!: number;
    let end!: number;
    // @ts-ignore
    const range = sel.getRangeAt(0); // 返回range对象
    [start, end] = [range.startOffset - 1, range.endOffset - 1];
    this.startOffset = start;
    this.endOffset = end;
  }

  private rowHover(row: any) {
    const styleSpan = '<span style="color:red;">' + row.text + '</span>';
    this.text = this.replaceChat(this.text, row.start, row.end, styleSpan);
  }
  private rowHoverLeave() {
    this.text = this.textTemp;
  }

  private replaceChat(
    source: string,
    start: number,
    end: number,
    newChar: string
  ) {
    var sFrontPart = source.substr(0, start);
    var sTailPart = source.substr(end, source.length);
    var sRet = sFrontPart + newChar + sTailPart;
    return sRet;
  }

  private filterTag(value: any, row: any) {
    return row.label === value;
  }
}
</script>

<style scoped lang="less">
.wrapper {
  display: flex;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  .text-list {
    height: 100%;
    width: 400px;
    background-color: #2a2e2f;
    border-right: 1px solid #dedede;
    overflow-y: auto;
    .text-item {
      font-size: 15px;
      color: #f3f3f3;
      font-weight: 500;
      text-align: left;
      padding: 0 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      height: 60px;
      cursor: pointer;
      margin: 20px 0;
    }
  }
  .annotation-wrapper {
    flex: 1;
    padding: 50px;
    .label-wrapper {
      padding: 1.5rem;
      align-items: center;
      color: #363636;
      display: flex;
      flex-grow: 1;
      font-weight: 700;
      padding: 0.75rem;
      background-color: royalblue;
      .label {
        align-items: center;
        background-color: #f5f5f5;
        border-radius: 4px;
        color: #4a4a4a;
        display: inline-flex;
        font-size: 0.75rem;
        height: 2em;
        justify-content: center;
        line-height: 1.5;
        white-space: nowrap;
        padding: 5px 10px;
        margin-right: 10px;
        cursor: pointer;
      }
    }
    .text-data {
      background-color: #fff;
      box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1),
        0 0 0 1px rgba(10, 10, 10, 0.1);
      color: #4a4a4a;
      max-width: 100%;
      position: relative;
      padding: 1.5rem;
      font-size: 16pt;
      line-height: 250%;
      margin-bottom: 20px;
      text-align: left;
    }
    .record {
      width: 100%;
      text-align: center;
    }
  }
}
</style>
